/*
 * @Description: Service事件通信机制
 * 观察者模式
 * 中间件洋葱圈
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-12-07 09:55:58
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-02-08 10:43:49
 */

export default class EventSub {
	events: { [propName: string]: Function[] };
	constructor() {
		this.events = {};
	}

	/**
	 * 发消息
	 *  回调触发【洋葱圈】
	 * @param {string} eventName
	 * @param  {*} args
	 */
	emit(eventName: string, ...args: any) {
		const cbs = this.events[eventName];
		if (!cbs) return this;
		const len = cbs.length;
		for (let i = 0; i < len; i++) {
			cbs[i].call(this, ...args);
		}
		return this;
	}

	/**
	 * 监听
	 * @param {string | Array} eventName
	 * @param {Function | Function[]} fn
	 */
	on(eventName: string | string[], fn: Function | Function[]) {
		if (Array.isArray(eventName)) {
			eventName.forEach(item => {
				this.on(item, fn);
			});
		} else {
			fn = Array.isArray(fn) ? fn : [fn];
			(this.events[eventName] || (this.events[eventName] = [])).push(...fn);
		}
		return this;
	}

	/**
	 * 解绑定
	 * @param {string} eventName
	 */
	fire(eventName?: string) {
		if (eventName) {
			this.events[eventName] = [];
		} else {
			this.events = {};
		}
	}
}
