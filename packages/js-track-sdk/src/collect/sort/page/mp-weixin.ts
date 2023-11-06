/*
 * @Description: 微信原生小程序页面/组件自动数据采集
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
import { aop } from '@js-track/shared/utils';
import { PageCollect } from './common';

class WXPageCollect extends PageCollect {
	presetFunction: string[] = [
		'onHide',
		'onLoad',
		'onReady',
		'onResize',
		'onRouteDone',
		'onShow',
		'onTabItemTap',
		'onRouteEnd',
		'onUnload',
		'onPullDownRefresh',
		'onReachBottom',
		'tapHandler',
		'__callPageLifeTime__'
	];
	constructor() {
		super();
		this.onLoad = aop.after(this.onLoad, (page: any) => {
			/**
			 * 无痕埋点
			 */
			console.log('page onLoad page Object', page);
			// 原生小程序 页面无痕埋点
			this.autoCollect(page);
		});
	}
	/**
	 * 页面自动上报【点击自动上报、曝光】
	 * 1.id
	 * 2.事件
	 * @param {IEvent} event
	 *
	 */
	autoCollect(page: any) {
		if (!page) return;
		// 兼容uni框架
		const pageAttrs = Object.keys(page);
		pageAttrs.forEach(methodName => {
			if (typeof page[methodName] === 'function' && this.presetFunction.indexOf(methodName) < 0) {
				page[methodName] = aop.before(page[methodName], (...args: IEvent[]) => {
					console.log('page aop start', methodName, 'args:', args);
					// 判断事件是否符合自动埋点
					if (this.isAutoCollectEvent(args[0])) {
						const viewId = this.getViewId(args[0]); // 当前控件Id
						if (!viewId) return;
						const code = `${page.route}#${viewId}#${args[0].type}`;
						this.aopHandle(viewId, args[0], code);
					} else if (args[0] && args[0].type === 'message') {
						this.h5WebCollect(args[0], page);
					}
				});
			}
		});
	}
}

export default new WXPageCollect();
