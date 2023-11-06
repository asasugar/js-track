/*
 * @Description: SDK 配置
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-06 14:02:10
 */

import uiClient from '@js-track/platform-api';

const DEFAULT: JTBusiness.SdkBaseConfigOptions = {
	client: 'uni',
	domain: `https://xxx.xxx.xxx`,
	lifecycleIdFormat: 'xxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx-xxxxxxxxxxxxx',
	/**
	 * 接口环境
	 */
	apiEnv: 'prod',

	appName: 'js-track',

	// SessionId刷新间隔
	sessionidRefreshInterval: 5 * 60 * 1000,

	// 上传monitor时间间隔：每隔30秒，上传文件中事件一次
	uploadInterval: 30 * 1000,

	// 每次上传最大条数
	maxMessageSize: 20,

	// 上传存储最大空间
	maxUploadIndex: 20,

	// 内存缓存最大条数
	maxStoreCacheSize: 40,

	// 从Cache写入Local时间间隔: 每隔8秒存储至文件一次
	saveStoreInterval: 8 * 1000,

	// Local本地缓存分隔符
	separator: '',

	// 虑重：最小点击事件间隔
	minClickInterval: 60,

	// 自动埋点开关
	isAutoCollect: true,

	// 接口， 获取业务数据
	businessInterface: {},

	// 数据加密密钥
	encryptionKey: '',
	// 需要扩展的附加属性
	extendsPropertyKeys: [],

	clientType: '',
	sdkType: 'android',
	sdkVersion: '',
	sessionidUuidFormat: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
};

class SDKConfig {
	config: JTBusiness.SdkBaseConfigOptions;
	eventType = {
		ACTION: '1', // 用户行为触发事件(action)
		AUTO: '2', // APP自动触发（auto)
		PV: '3', // 页面浏览事件(pv)
		START_END: '4', // 启动关闭类
		CALLBACK: '5', // APP接收回调后触发（callback）
		APM: '6' // 调试监控类
	};
	constructor() {
		this.config = {
			...DEFAULT
		};
	}

	init(config?: JTBusiness.SdkBaseConfigOptions): JTBusiness.SdkBaseConfigOptions {
		this.config = {
			...DEFAULT,
			...config
		};
		return this.config;
	}

	/**
	 * 初始化系统信息
	 */
	async initSystem() {
		const systemInfo = uiClient.getSystemInfo();
		if (systemInfo) {
			this.config.systemInfo = systemInfo;
		}
		const networkType = await uiClient.getNetworkType();
		if (networkType) {
			this.config.networkType = networkType;
		}
	}

	/**
	 * 获取config对象属性【深层属性】
	 * @param {string} type
	 */
	getAttr(type: string) {
		const types: string[] = type.split('.');
		let attr;
		types.forEach(item => {
			this.config && (attr = this.config[item as keyof JTBusiness.SdkBaseConfigOptions]);
		});
		return attr;
	}
}

export default new SDKConfig();
