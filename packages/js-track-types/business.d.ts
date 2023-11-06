declare namespace LTBusiness {
	type Env = 'prod' | 'pre' | 'test03' | 'test04';

	type Client = 'my' | 'wx' | 'tt' | 'uni';

	type SdkType = 'android' | 'ios' | 'weixinmini' | 'web' | 'alipaymini' | 'tiktokmini';

	type FromMini = 'mini' | 'coffeealipay' | 'coffeett';

	type Platform = '3' | '5' | '6';

	type Delivery = '0' | '1'; // 0自提 1外送

	type Properties = {
		department_id?: string;
		department_name?: string;
		supporttakeout?: Delivery;
		[propName: string]: any;
	};

	type ShopInfo = {
		deptId: string;
		deptName: string;
		delivery: Delivery;
	};

	interface SdkBaseConfigOptions extends AnyObject {
		clientType: string;
		frommini: FromMini;
		apiEnv: Env;
		appName: string;
		sdkType: SdkType;
		sdkVersion: string;
		platform: Platform;
		appKey: string;
		lifecycleIdFormat: string;
		distinctIdFormat: string;
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
		childClientType?: string;
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

	interface MonitorParmas extends LocationOptions, SystemOptions {
		track_type: string;
		platform: Platform;
		app_key: string;
		shopInfo: ShopInfo; // * new 替代dept_id
		loginStatus: boolean; // * new
		lifecycle_id: string;
		distinct_id: string;
		token_id: string;
		event_time: string;
		track_id: string;
		collect_id: number;
		upload_id: string;
		login_id: string;
		user_id: string;
		open_id: string;
		union_id: string;
		sdk_version: string;
		event_code: string;
		event_type: string;
		session_id: string;
		spm: string;
		current_page_code?: string;
		app_version?: string;
		app_name?: string;
		sdk_type?: SdkType;
		network_type?: string;
		properties?: Properties;
	}

	interface EventOptions {
		eventCode: string;
		eventType: string;
		trackType: string;
		eventTime?: number;
		data?: AnyObject;
	}

	interface BaseInfo {
		encryptionKey: string;
		platform: Platform;
		appKey: string;
		appName?: string;
		sdkType?: SdkType;
		domain?: string;
		wsDomain?: string;
	}
}
