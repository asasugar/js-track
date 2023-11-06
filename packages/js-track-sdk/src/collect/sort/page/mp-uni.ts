/*
 * @Description: 页面/组件自动数据采集(UniApp-Vue3)
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
import logger from '@/foundation/logger';
import { PageCollect } from './common';

class UNIPageCollect extends PageCollect {
	/**
	 * 页面自动上报【点击自动上报、曝光】
	 * 1.id
	 * 2.事件
	 * @param {IEvent} event
	 *
	 */
	autoCollect(event: IEvent, instance: any) {
		if (!event) return;
		// logger.info('【LUNIKTRACK!!! collect start】', event, instance);

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
}

export default new UNIPageCollect();
