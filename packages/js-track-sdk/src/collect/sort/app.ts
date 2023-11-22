/*
 * @Description: 系统启动关闭收集
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-20 19:05:26
 */
import SDKConfig from '@/config';
import { APP_START } from '@/constant/eventKey';
import { IS_FIRST_START_JS_TRACK } from '@/constant/localKey';
import { AppProperties } from '@/message';
import { getStorage, setStorage } from '@/utils/storage';
import uiClient from '@js-track/platform-api';
import { generateUUID } from '@js-track/shared/utils';
import wsService from '../../upload/base/ws';
import collectService from '../event';

class AppCollect {
	#isFirstStart = false;
	#isFirstAppShow = true; // 小程序是否第一次到前台
	startTime = 0; // app启动时间
	#lastAppHideTime = 0; // 最后一次小程序退入后台的时间戳
	sessionId = '0'; // 会话id
	init() {
		// 注册小程序前后台切换
		uiClient.onAppShow(() => {
			this.appOnShow();
		});
		uiClient.onAppHide(() => {
			this.appOnHide();
		});
	}

	/**
	 * 小程序切换到前台
	 * 如果app没有切换到后台过，则认为是第一次启动，生成sessionId
	 * 如果app切换到后台，重新拉起，间隔超过阈值，生成新sessionId。
	 * 首次切换到前台：不记录热启动。
	 * 非首次切换到前台：记录热启动。
	 */
	appOnShow() {
		const { sessionidRefreshInterval, sessionidUuidFormat, launchOptions, request_type } =
			SDKConfig.config;

		console.log('app onShow===========>埋点request_type:', request_type);

		// 小程序切换到前台时判断如果socket是关闭状态则重新初始化通道
		if (request_type === 'ws' && wsService.socketTask?.readyState === 3) {
			wsService.init(); // 重新连接socket
		}

		if (!this.#isFirstAppShow) {
			this.appStart('2', launchOptions);
		}
		this.#isFirstAppShow = false;
		this.sessionId = generateUUID(sessionidUuidFormat);
		if (this.#lastAppHideTime && Date.now() - this.#lastAppHideTime >= sessionidRefreshInterval) {
			collectService.eventRealTime('session_id_refresh', {}, SDKConfig.eventType.START_END, '1');
		}
	}

	/**
	 * 小程序切换到后台
	 */
	appOnHide() {
		this.#lastAppHideTime = Date.now();
		// App热启动事件
		collectService.event('app_end', {}, SDKConfig.eventType.START_END, '1');
		// 小程序切换到后台时关闭socket通道
		wsService.close(); // 断开socket连接
	}
	updateStartTime(time: number) {
		this.startTime = time;
	}
	/**
	 * 系统启动
	 * @param {*} launchType
	 * @param {*} options
	 */
	async appStart(launchType: string, options?: AnyObject) {
		this.#isFirstStart = false;
		const firstStartTime = getStorage(IS_FIRST_START_JS_TRACK);
		if (!firstStartTime) {
			this.#isFirstStart = true;
			setStorage(IS_FIRST_START_JS_TRACK, Date.now());
		}
		const { sourceFrom, query } = options || {};

		const properties = new AppProperties();

		properties.launch_type = launchType;
		properties.is_first_day = this.#isFirstStart;
		properties.launch_source_from = sourceFrom;
		properties.query = query;

		collectService.eventRealTime(APP_START, properties, SDKConfig.eventType.START_END, '1');
	}
}

export default new AppCollect();
