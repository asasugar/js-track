/*
 * 日志管理
 * 1.默认level4【time】
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-12-07 09:55:58
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-10-24 18:43:58
 */
import { isFunction } from './is';

/**
 * 日志管理
 *  等级管理
 *  关闭日志
 *  默认console
 */

/**
 * 日志等级对象
 */
export const LOGGER_LEVEL = {
	track: 1,
	debug: 2,
	info: 3,
	time: 4,
	warn: 5,
	error: 6,
	off: 99
};

export class Logger {
	handler: Function;
	level: number;
	constructor() {
		this.level = LOGGER_LEVEL.track;
		this.handler = this.defaultHandler();
	}

	/**
	 * 默认日志处理
	 */
	defaultHandler() {
		return (...args: any[]) => {
			if (console) {
				console.log(...args);
			}
		};
	}
	/**
	 * 设置日志等级
	 * @param {*} level
	 */
	setLevelAction(level: number) {
		this.level = level || LOGGER_LEVEL.track;
		return this;
	}

	/**
	 * 设置日志处理方法
	 * @param {*} handler
	 */
	setHandlerAction(handler: Function) {
		if (isFunction(handler)) {
			this.handler = handler;
		}
	}

	/**
	 * 关闭日志
	 */
	offAction() {
		this.level = LOGGER_LEVEL.off;
	}

	trace(...args: any[]) {
		this.invoke(LOGGER_LEVEL.track, ...args);
	}

	debug(...args: any[]) {
		this.invoke(LOGGER_LEVEL.debug, ...args);
	}

	info(...args: any[]) {
		this.invoke(LOGGER_LEVEL.info, ...args);
	}

	warn(...args: any[]) {
		this.invoke(LOGGER_LEVEL.warn, ...args);
	}

	error(...args: any[]) {
		this.invoke(LOGGER_LEVEL.error, ...args);
	}

	time(...args: any[]) {
		this.invoke(LOGGER_LEVEL.time, ...args);
	}

	enabledFor(level: number) {
		return level >= this.level;
	}

	invoke(level: number, ...args: any[]) {
		if (this.handler && this.enabledFor(level)) {
			this.handler(...args);
		}
	}
}
