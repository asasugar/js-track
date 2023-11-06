/*
 * @Description: 系统启动关闭收集
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-09-08 17:28:36
 */
import SDKConfig from '@js-track/config';
import { APP_START } from '@js-track/constant/eventKey';
import { IS_FIRST_START_JSTRACKSDK } from '@js-track/constant/localKey';
import { AppProperties } from '@js-track/message';
import { getStorage, setStorage } from '@js-track/utils/storage';
import collectService from '../event';

class AppCollect {
	#isFirstStart: boolean = false;
	startTime: number = 0; // app启动时间

	/**
	 * 系统启动
	 * @param {*} launchType
	 * @param {*} options
	 */
	async appStart(options?: AnyObject) {
		this.#isFirstStart = false;
		const firstStartTime = getStorage(IS_FIRST_START_JSTRACKSDK);
		if (!firstStartTime) {
			this.#isFirstStart = true;
			setStorage(IS_FIRST_START_JSTRACKSDK, Date.now());
		}
		const { sourceFrom, query } = options || {};

		const properties = new AppProperties();

		properties.is_first_day = this.#isFirstStart;
		properties.launch_source_from = sourceFrom;
		properties.query = query;

		collectService.eventRealTime(APP_START, properties, SDKConfig.eventType.START_END, '1');
	}
}

export default new AppCollect();
