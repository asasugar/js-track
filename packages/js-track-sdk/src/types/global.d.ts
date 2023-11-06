export type Env = 'prod' | 'pre' | 'test03' | 'test04';

export type Client = 'my' | 'wx' | 'tt' | 'uni';

export interface Properties {
	department_id?: string;
	department_name?: string;
	supporttakeout?: Delivery;
	[propName: string]: any;
}

export interface ShopInfo {
	deptId: string;
	deptName: string;
	delivery: Delivery;
}

export interface SdkBaseConfigOptions extends AnyObject {
	apiEnv: Env;
	appName: string;
	sessionidRefreshInterval: number;
	uploadInterval: number;
	maxMessageSize: number;
	maxUploadIndex: number;
	saveStoreInterval: number;
	separator: string;
	minClickInterval: number;
	isAutoCollect: boolean;
	businessInterface: Record<string, () => any>;
	encryptionKey: string;
	systemInfo?: UniApp.GetSystemInfoResult;
	networkType?: string;
	debug?: boolean;
	launchOptions?: App.LaunchShowOption;
	childClientType?: string;
	miniversion?: string;
	wsLog?: boolean;
	extendsPropertyKeys?: string[];
	lifecycleIdFormat: string;
}

export interface SystemOptions {
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
}


export interface TrackParmas extends  SystemOptions {
	track_type: string;
	loginStatus: boolean; // * new
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
	properties?: Properties;
}

export interface EventOptions {
	eventCode: string;
	eventType: string;
	trackType: string;
	eventTime?: number;
	properties?: AnyObject;
}

export interface BaseInfo {
	encryptionKey: string;
	platform: Platform;
	appKey: string;
	appName?: string;
	sdkType?: SdkType;
	domain?: string;
}

export interface Event {
	changedTouches: [
		{
			clientX: number;
			clientY: number;
			force: number;
			identifier: number;
			pageX: number;
			pageY: number;
		}
	];
	currentTarget: {
		dataset: AnyObject;
		id: string;
		offsetLeft: number;
		offsetTop: number;
	};
	detail: {
		source: string;
		x: number;
		y: number;
		value?: string | number;
		data?: any[];
	};
	mark: AnyObject;
	mut: boolean;
	target: {
		dataset: AnyObject;
		id: string;
		offsetLeft: number;
		offsetTop: number;
	};
	timeStamp: number;
	touches: [
		{
			clientX: number;
			clientY: number;
			force: number;
			identifier: number;
			pageX: number;
			pageY: number;
		}
	];
	type: string;
	_userTap: boolean;
	_relatedInfo?: {
		anchorTargetText?: string;
	};
}
