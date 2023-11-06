/*
 * 日志管理
 * 1.默认level4【time】
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-12-07 09:55:58
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-06 14:06:13
 */
import { Logger } from '@js-track/shared/utils';

const logger = new Logger();

logger.setHandlerAction((...args: any[]) => {
	if (console) {
		console.log('monitor', new Date().toString(), ...args);
	}
});

export default logger;
