declare namespace JTBusiness {
	type Env = 'prod' | 'pre' | 'test03' | 'test04';

	type Client = 'weixin' | 'uni';

	type SdkType = 'android' | 'ios' | 'weixinmini' | 'web' | 'alipaymini' | 'tiktokmini';

	interface SdkBaseConfigOptions extends AnyObject {
		domain?: string;
		wsDomain?: string;
		client: Client;
		apiEnv: Env;
		request_type?: 'ws' | 'http';
		appName: string;
		sdkType: SdkType;
		sdkVersion: string;
		lifecycleIdFormat: string;
		sessionidUuidFormat: string;
		sessionidRefreshInterval: number;
		uploadInterval: number;
		maxMessageSize: number;
		maxUploadIndex: number;
		saveStoreInterval: number;
		separator: string;
		minClickInterval: number;
		isAutoCollect: boolean;
		businessInterface: {
			[propName: string]: () => any;
		};
		encryptionKey: string;
		systemInfo?: UniApp.GetSystemInfoResult | WechatMiniprogram.SystemInfo;
		networkType?: string;
		debug?: boolean;
		launchOptions?: App.LaunchShowOption;
		miniversion?: string;
		wsLog?: boolean;
		extendsPropertyKeys?: string[];
	}

	interface SystemOptions {
		sm_device_id: string; // * new 设备 id 。由 uni-app 框架生成并存储，清空 Storage 会导致改变
		os_type: string; // 客户端平台，值域为：ios、android、mac（3.1.10+）、windows（3.1.10+）、linux（3.1.10+）
		os_version: string; // 操作系统名称及版本，如Android 10
		wx_version: string; // ? 引擎版本号(这里没说支付宝不支持)
		wx_sdk_version: string; // 客户端基础库版本(支付宝不支持)
		model: string; // 设备型号
		screen_height: number; // 屏幕高度
		screen_width: number; // 屏幕宽度
		manufacturer?: string; // 设备品牌
		system_language?: string; // 应用设置的语言
		benchmarkLevel?: number; // 系统语言
	}

	interface LocationOptions {
		latitude: string;
		longitude: string;
		city_id: string;
		city: string;
		province: string;
		province_id: string;
		country: string;
		country_id: string;
	}

	interface MonitorParmas extends SystemOptions {
		track_type: string;
		loginStatus: boolean;
		lifecycle_id: string;
		token_id: string;
		event_time: string;
		upload_id: string;
		login_id: string;
		user_id: string;
		sdk_version: string;
		event_code: string;
		event_type: string;
		spm: string;
		current_page_code?: string;
		app_version?: string;
		app_name?: string;
		sdk_type?: SdkType;
		network_type?: string;
		properties?: AnyObject;
	}

	interface EventOptions {
		eventCode: string;
		eventType: string;
		trackType: string;
		eventTime?: number;
		properties?: AnyObject;
	}
}
