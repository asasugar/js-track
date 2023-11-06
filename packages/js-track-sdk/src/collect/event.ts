/*
 * @Description: 采集方法
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-06 11:28:38
 */
import Config from '@/config';
import logger from '@/foundation/logger';
import { BaseMessage } from '@/message';
import uploadService from '@/upload';

export class CollectEvent {
	/**
	 * 拼接基础数据Message
	 * @param {*} params
	 *  eventCode 事件唯一id
	 *  eventType 事件类型【1手动、2自动】
	 *  trackType 埋点类型【1自动、2手动】
	 *  data
	 */
	#messageGenerator(params: JTBusiness.EventOptions): JTBusiness.MonitorParmas {
		const { eventCode, eventType, trackType, properties } = params || {};
		const msg = BaseMessage.init();
		msg.event_code = eventCode;
		msg.properties = properties;
		msg.event_type = eventType;
		msg.track_type = trackType;

		return msg;
	}

	/**
	 * 手动埋点事件
	 * 延迟批量
	 */
	event(
		eventCode: string,
		properties: AnyObject = {},
		eventType: string = Config.eventType.ACTION,
		trackType = '2'
	) {
		const msg = this.#messageGenerator({
			eventCode,
			eventType,
			trackType,
			properties
		});
		uploadService.save(msg);
		logger.info(['JSTRACKSDK SAVE!!!', msg.event_code, msg]);
	}

	/**
	 * 手动埋点事件:实时上传
	 */
	eventRealTime(
		eventCode: string,
		properties: AnyObject = {},
		eventType: string = Config.eventType.ACTION,
		trackType = '2'
	) {
		const msg = this.#messageGenerator({
			eventCode,
			eventType,
			trackType,
			properties
		});
		uploadService.send(msg);
		logger.info(['JSTRACKSDK REAL TIME!!!', msg.event_code, msg]);
	}
}

export default new CollectEvent();
