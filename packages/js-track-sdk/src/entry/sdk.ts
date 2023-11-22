/*
 * @Description: 小程序数据SDK /基础能力 /生命周期管理
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-09-30 14:18:15
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-20 19:06:37
 */

import appCollectService from '@/collect/sort/app';
import SDKConfig from '@/config';
import loggerService from '@/foundation/logger';
import uploadService from '@/upload';
import uiClient from '@js-track/platform-api';

class SDK {
	async init(config: JTBusiness.SdkBaseConfigOptions) {
		// 配置初始化
		const c = SDKConfig.init(config);
		// 日志控制
		if (!c.debug) {
			loggerService.offAction();
		}
		// UI框架初始化
		uiClient.init(c.client);
		// 获取系统信息和网络状态
		await SDKConfig.initSystem();
		// 上传模块初始化
		uploadService.init(c);

		// 注册小程序前后台切换
		appCollectService.init();
		// 待小程序初始化完成发送app_start事件
		appCollectService.appStart('1');
		appCollectService.updateStartTime(Date.now());
	}

	clear() {
		uploadService.clear();
	}
}

export default new SDK();
