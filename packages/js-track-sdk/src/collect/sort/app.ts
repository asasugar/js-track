/*
 * @Description: 系统启动关闭收集
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-06 14:06:44
 */
import SDKConfig from '@/config';
import { APP_START } from '@/constant/eventKey';
import { IS_FIRST_START_JS_TRACK } from '@/constant/localKey';
import { AppProperties } from '@/message';
import { getStorage, setStorage } from '@/utils/storage';
import collectService from '../event';

class AppCollect {
	#isFirstStart = false;
	startTime = 0; // app启动时间

	/**
	 * 系统启动
	 * @param {*} launchType
	 * @param {*} options
	 */
	async appStart(options?: AnyObject) {
		this.#isFirstStart = false;
		const firstStartTime = getStorage(IS_FIRST_START_JS_TRACK);
		if (!firstStartTime) {
			this.#isFirstStart = true;
			setStorage(IS_FIRST_START_JS_TRACK, Date.now());
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
