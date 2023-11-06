/*
 * @Description: 页面/组件自动数据采集
 * 1.onLoad
 * 2.onShow
 * 3.onHide
 * 4.onUnload
 * 5.自动上报【点击自动上报、曝光】
 * 6.自动上报
 *  组件id属性
 *  组件tap、change、submit事件
 * 7.自动埋点开关
 *  配置中心接口
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-11-21 16:03:48
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2022-11-22 17:13:40
 */
import Config from '@/config';
import logger from '@/foundation/logger';
import { PageProperties } from '@/message';
import uiClient from '@js-track/platform-api';
import { aop } from '@js-track/shared/utils';
import collectService from '../../event';

const aopBindTypes = ['tap', 'submit', 'change']; // AOP捕获的 IEvent type列表
export class PageCollect {
	lastShowTime = 0; // 最后一次进入页面时间戳
	lastHideTime = 0; // 最后一次离开页面时间戳
	lastEventCode = ''; //  最后一个事件code
	lastEventTime = 0; // 最后事件产生时间
	route = ''; // 当前的路由名称
	lastRoute = ''; // 上一次的路由名称
	/**
	 * Page：onLoad
	 * 页面onLoad() 方法中调用
	 *
	 * 页面跳转事件：（Route）
	 * 通过AOP方式在 onShow 和 onHide/onUnload方法中调用相关统计方法。
	 * 备注：onShow 与 (onHide 或 onUnload）成对出现
	 *
	 * TabBar点击事件（Event）：
	 * 通过AOP方式，在onTabItemTap方法后调用event统计方法。
	 * 格式：page#text#onTabItemTap
	 *
	 * 点击事件：（Event）
	 * 通过View 与js function 的绑定关系，在相应function执行前进行AOP统计。
	 *
	 * 点击事件格式：
	 * eventCode:     {page|component}#view_id#{tap|change|submit}
	 */
	onLoad(page: any) {
		if (!page) {
			logger.error('page onLoad error, page is empty', page);
			return;
		}

		this.route = page.route;
		// 监听localService的错误事件
		page.onShow = aop.after(page.onShow, () => {
			this.#onShow(page.route);
		});
		page.onHide = aop.after(page.onHide, () => {
			this.#onHide(page.route);
		});
		page.onUnload = aop.after(page.onUnload, () => {
			this.#onHide(page.route);
			// 判断如果是data中有monitor_web_last_start_data缓存，则需要增加 web_page_end 事件
			// monitor_web_last_start_data 存储的是web回传回的data的 String，需要转化为对象
			const webLastStartData = page.data?.monitor_web_last_start_data;
			if (webLastStartData) {
				let lastStartData;
				try {
					lastStartData = JSON.parse(webLastStartData);
				} catch (e) {
					logger.error('collect page onLoad page.onUnload', e);
				}

				if (lastStartData) {
					const { properties } = lastStartData;
					if (properties) {
						if (properties.page_start_time) {
							properties.page_end_time = Date.now();
							properties.duration = Date.now() - Number(properties.page_start_time);
						}
						collectService.event(
							'web_page_end',
							properties,
							lastStartData.event_type,
							lastStartData.track_type
						);
					}
				}
			}
		});

		page.onTabItemTap = aop.after(page.onTabItemTap, (...args: AnyObject[]) => {
			this.#onTabItemTap(page.route, args?.[0]?.text);
		});

		// 自动埋点开关
		if (!Config.config.isAutoCollect) return;

		/**
		 * 无痕埋点
		 */
	}

	/**
	 * 页面进入
	 * @param {string} pageName
	 */
	#onShow(pageName: string) {
		this.lastShowTime = Date.now();

		const properties = new PageProperties();

		properties.page_start_time = this.lastShowTime;
		properties.page_id = pageName; // 页面路由
		properties.refer = this.lastRoute; // 上一个页面

		collectService.event('page_start', properties, Config.eventType.PV, '1');
	}
	/**
	 * 页面离开
	 * @param {string} pageName
	 */
	#onHide(pageName: string) {
		this.lastHideTime = Date.now();
		this.lastRoute = uiClient.getTopPageName();
		const properties = new PageProperties();

		(properties.page_start_time = this.lastShowTime),
			(properties.page_end_time = this.lastHideTime);
		properties.duration = this.lastHideTime - this.lastShowTime;
		properties.page_id = pageName;
		properties.page_end_time = this.lastHideTime;

		collectService.event('page_end', properties, Config.eventType.PV, '1');
	}

	/**
	 * 切换原生tab
	 * @param {string} pageName
	 * @param {string} text
	 */
	#onTabItemTap(pageName: string, text?: string) {
		if (text) {
			collectService.event(`${pageName}#${text}#onTabItemTap`);
		}
	}
	/**
	 * 根据用户传递的aopmethodsName，获取上报数据
	 * @param {string} viewId
	 * @param {IEvent} event
	 * @param {string} eventCode
	 */
	aopHandle(viewId: string, event: IEvent, eventCode: string, customProperties?: AnyObject) {
		const data: any = {
			element_id: viewId,
			department_id: `${Config.config.businessInterface?.getDeptId?.() ?? ''}`,
			element_content: this.#getElementContent(event)
		};

		if (
			eventCode !== this.lastEventCode ||
			Date.now() - this.lastEventTime > Config.config.minClickInterval
		) {
			logger.info('用于未来扩展支持携带数据的自动埋点数据:', customProperties);
			collectService.event(eventCode, data);
		} else {
			logger.info('【aopHandle click too many】');
		}

		this.lastEventCode = eventCode;
		this.lastEventTime = Date.now();
	}
	/**
	 * H5页面传输事件回传事件统计
	 * 保存最后一个web_page_start事件的data 的 String
	 */
	h5WebCollect(event: IEvent, page: any) {
		const dataArr = event?.detail?.data;
		if (dataArr && dataArr.length) {
			let lastWebPageStartData;
			dataArr.forEach(item => {
				if (item.type === 'monitor') {
					const {
						event_code: eventCode,
						event_type: eventType,
						track_type: trackType,
						properties: data
					} = item.data || {};

					collectService.event(eventCode, data, eventType, trackType);

					if (eventCode === 'web_page_start') {
						lastWebPageStartData = JSON.stringify(item.data);
					}
				}
			});
			page.data = page.data || {};
			page.data.monitor_web_last_start_data = lastWebPageStartData;
		}
	}

	/**
	 * 获取控件ID
	 * @param {IEvent} event 标签指定id属性
	 * @returns {string} viewId {page|component}#view_id#{tap|change|submit}
	 */
	getViewId(event: IEvent): string {
		let viewId = '';
		const { currentTarget, target, type, detail } = event || {};
		// 避免页面跟组件点击穿透导致id透传
		if (
			target?.dataset?.eventOpts?.[0]?.[1]?.[0]?.[0] !==
			currentTarget?.dataset?.eventOpts?.[0]?.[1]?.[0]?.[0]
		)
			return viewId;

		if (currentTarget?.id) {
			viewId = currentTarget.id;
		} else if (target?.id) {
			viewId = target.id;
		}
		if (type === 'change') {
			if (detail?.value) {
				viewId = `${viewId}_${detail.value}`;
			}
		}
		return viewId;
	}

	/**
	 * 获取控件自定义埋点参数【应用场景：触点数据】
	 * @param {IEvent} event 标签指定trackProperties属性
	 * @returns {undefined | AnyObject}
	 */
	getCustomProperties(event: IEvent): undefined | AnyObject {
		const { extendsPropertyKeys } = Config.config;
		const map: AnyObject = {};
		if (extendsPropertyKeys?.length) {
			for (const value of extendsPropertyKeys) {
				const { currentTarget, target } = event || {};
				const properties = currentTarget?.dataset?.[value] || target?.dataset?.[value];
				if (properties) {
					map[value] = properties;
				}
			}
		}
		return map;
	}
	/**
	 * 当前控件文字内容
	 */
	#getElementContent(event: IEvent) {
		return event?._relatedInfo?.anchorTargetText ?? '';
	}

	/**
	 * 判断是否符合aop绑定的监听事件
	 * @param {IEvent} event 标签指定id属性
	 * @returns {boolean}
	 */
	isAutoCollectEvent(event: IEvent) {
		if (event && aopBindTypes.indexOf(event.type) >= 0) {
			// 过滤Banner图自动滚动统计
			if (event.type === 'change' && event.detail?.source === 'autoplay') {
				return false;
			}
			return true;
		}
		return false;
	}
}
