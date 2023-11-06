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
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2022-11-22 17:13:40
 */
import Config from '@js-track/config';
import { PageProperties } from '@js-track/message';
// import uiclient from '@js-track/uiclient';
import { PAGE_END, PAGE_START } from '@js-track/constant/eventKey';
import logger from '@js-track/foundation/logger';
import aop from '@js-track/utils/aop';
import collectService from '../event';

import type { Event } from '#/global';

const aopBindTypes = ['tap', 'submit', 'change']; // AOP捕获的 Event type列表

class PageCollect {
	lastShowTime: number = 0; // 最后一次进入页面时间戳
	lastHideTime: number = 0; // 最后一次离开页面时间戳
	lastEventCode: string = ''; //  最后一个事件code
	lastEventTime: number = 0; // 最后事件产生时间
	route: string = ''; // 当前的路由名称
	lastRoute: string = ''; // 上一次的路由名称
	/**
	 * Page：onLoad
	 * 页面onCreate() 方法中调用
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
	start(page: any) {
		// 自动埋点开关
		if (!Config.config.isAutoCollect) return;

		if (!page) {
			logger.error('page onLoad error, page is empty', page);
			return;
		}

		this.route = page.route;

		page.onShow = aop.after(page.onShow, () => {
			this.#onShow(page.route);
		});
		page.onHide = aop.after(page.onHide, () => {
			this.#onHide(page.route);
		});
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

		collectService.event(PAGE_START, properties, Config.eventType.PV, '1');
	}
	/**
	 * 页面离开
	 * @param {string} pageName
	 */
	#onHide(pageName: string) {
		this.lastHideTime = Date.now();
		// this.lastRoute = uiclient.getTopPageName();
		const properties = new PageProperties();

		(properties.page_start_time = this.lastShowTime),
			(properties.page_end_time = this.lastHideTime);
		properties.duration = this.lastHideTime - this.lastShowTime;
		properties.page_id = pageName;
		properties.page_end_time = this.lastHideTime;

		collectService.event(PAGE_END, properties, Config.eventType.PV, '1');
	}

	/**
	 * 根据用户传递的aopmethodsName，获取上报数据
	 * @param {string} viewId
	 * @param {Event} event
	 * @param {string} eventCode
	 */
	aopHandle(viewId: string, event: Event, eventCode: string, customProperties?: AnyObject) {
		let data: any = {
			element_id: viewId,
			department_id: `${Config.config.businessInterface?.getDeptId?.() ?? ''}`,
			element_content: this.getElementContent(event)
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
	 * 页面自动上报【点击自动上报、曝光】
	 * 1.id
	 * 2.事件
	 * @param {Event} event
	 *
	 */
	autoCollect(event: Event, instance: any) {
		if (!event) return;
		// logger.info('【JSTRACKSDK!!! collect start】', event, instance);

		const viewId = this.getViewId(event);

		if (viewId) {
			logger.info('id+事件 符合无痕埋点要求');

			let code = '';
			if (instance?.ctx?.$mpType === 'component' && instance?.type?.__file) {
				const componentFile = instance.type.__file.substring(
					instance.type.__file.indexOf('src'),
					instance.type.__file.indexOf('.vue')
				);
				// 组件自动埋点code
				code = `${this.route}#${componentFile}#${instance?.attrs?.id ?? viewId}#${
					event.type || 'tap'
				}`;
			} else {
				// 页面自动埋点code
				code = `${this.route}#${viewId}#${event.type || 'tap'}`;
			}
			const customProperties = this.getCustomProperties(event);
			this.aopHandle(viewId, event, code, customProperties);
		}
	}

	/**
	 * 获取控件ID
	 * @param {Event} event 标签指定id属性
	 * @returns {string} viewId {page|component}#view_id#{tap|change|submit}
	 */
	getViewId(event: Event): string {
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
	 * @param {Event} event 标签指定trackProperties属性
	 * @returns {undefined | AnyObject}
	 */
	getCustomProperties(event: Event): undefined | AnyObject {
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
	getElementContent(event: Event) {
		return event?._relatedInfo?.anchorTargetText ?? '';
	}

	/**
	 * 判断是否符合aop绑定的监听事件
	 * @param {Event} event 标签指定id属性
	 * @returns {boolean}
	 */
	isAutoCollectEvent(event: Event) {
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

export default new PageCollect();
