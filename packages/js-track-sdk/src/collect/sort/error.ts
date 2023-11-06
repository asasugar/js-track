/*
 * @Description: 系统错误收集
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-06 11:30:22
 */
import Config from '@/config';
import { ErrorProperties } from '@/message';
import collectService from '../event';
import appCollect from './app';

class ErrorCollect {
	error(type: string, name: string, stack: string, remark?: string) {
		const properties = new ErrorProperties();
		properties.type = type;
		properties.name = name;
		properties.stack = stack;
		properties.remark = remark;
		properties.duration = `${Date.now() - appCollect.startTime}`; // 使用时长
		collectService.event('error', properties, Config.eventType.APM, '1');
	}

	/**
	 * 堆栈信息报错
	 */
	onError(err: string): void {
		if (err && err.length) {
			const errLine = err.split('\n');
			let errorCode = `${errLine[0]}`;
			const errorStack = err;
			if (errLine.length > 2) {
				errorCode += `\n${errLine[1]}`;
			}
			this.error('js', errorCode, errorStack);
		}
	}
}

export default new ErrorCollect();
