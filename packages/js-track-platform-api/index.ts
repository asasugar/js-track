/**
 * 端：uni、wx
 */
import { isFunction, Logger } from '@js-track/shared/utils';

const logger = new Logger();
// 微信
const WX = 'weixin';
// uni大平台
const UNI = 'uni';
export class UIClient {
	client: any = null;
	static CLIENT(type: 'uni' | 'weixin' | string[]) {
		try {
			switch (type) {
				case UNI:
					return uni;
				// 微信
				case WX:
					return wx;
				// H5
				default:
					return uni;
			}
		} catch (e) {
			logger.error(e);
			return uni;
		}
	}

	init(type: 'uni' | 'weixin') {
		this.client = UIClient.CLIENT(type);
	}

	request<T extends string | AnyObject | ArrayBuffer = string | AnyObject | ArrayBuffer>(
		params: UniApp.RequestOptions | WechatMiniprogram.RequestOption | my.RequestOption
	): Promise<
		| UniApp.GeneralCallbackResult
		| WechatMiniprogram.RequestSuccessCallbackResult<T>
		| my.RequestSuccessCallbackResult
	> {
		return new Promise((resolve, reject) => {
			if (!params) return reject(new Error('params is empty'));

			if (!isFunction(params.success)) {
				params.success = function (
					content:
						| UniApp.GeneralCallbackResult
						| WechatMiniprogram.RequestSuccessCallbackResult<T>
						| my.RequestSuccessCallbackResult
				) {
					resolve(content);
				};
			}
			if (!isFunction(params.fail)) {
				params.fail = function (
					e:
						| UniApp.GeneralCallbackResult
						| WechatMiniprogram.RequestFailCallbackErr
						| my.RequestFailCallbackErr
				) {
					reject(e);
				};
			}
			if (!isFunction(params.complete)) {
				params.complete = function (
					content:
						| UniApp.GeneralCallbackResult
						| WechatMiniprogram.RequestSuccessCallbackResult<T>
						| my.RequestSuccessCallbackResult
				) {
					resolve(content);
				};
			}
			return (this.client as any)?.request(params);
		});
	}

	getLocalSync<T = any>(key: string): T {
		return this.client?.getStorageSync(key);
	}

	getLocal<T = string>(key: string): Promise<T> {
		return new Promise(resolve => {
			try {
				this.client?.getStorage({
					key,
					success(res: any) {
						resolve(res?.data);
					},
					fail() {
						resolve('' as T);
					}
				});
			} catch (e) {
				resolve('' as T);
			}
		});
	}

	setLocalSync(key: string, value: string | number | boolean | AnyObject) {
		this.client?.setStorageSync(key, value);
	}

	setLocal(key: string, value: any): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				this.client?.setStorage({
					key,
					data: value,
					success() {
						resolve(true);
					},
					fail(e: any) {
						reject(e);
					}
				});
			} catch (e) {
				reject(e);
			}
		});
	}

	removeLocalSync(key: string) {
		this.client?.removeStorageSync(key);
	}

	removeLocal(key: string): Promise<WechatMiniprogram.GeneralCallbackResult | any> {
		return new Promise(resolve => {
			try {
				this.client?.removeStorage({
					key,
					success(res: WechatMiniprogram.GeneralCallbackResult | any) {
						return resolve(res);
					}
				});
			} catch (e) {
				// logger.error(e);
			}
		});
	}

	clearLocal(isSync = true) {
		try {
			return this.client?.[`clearStorage${isSync ? 'Sync' : ''}`]();
		} catch (e) {
			// logger.error(e);
			return '';
		}
	}

	/**
	 * 小程序
	 * 获取当前Top页面路径
	 */
	getTopPageName(): string {
		const pages = getCurrentPages(); // 获取加载的页面
		if (pages.length > 0) {
			const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
			if (currentPage !== undefined && currentPage !== null) {
				return currentPage.route as string;
			}
		}
		return '';
	}

	getNetworkType(): Promise<string> {
		return new Promise(resolve => {
			this.client?.getNetworkType({
				success(
					res: UniApp.GetNetworkTypeSuccess | WechatMiniprogram.GetNetworkTypeSuccessCallbackResult
				) {
					resolve(res.networkType);
				},
				fail() {
					resolve('');
				}
			});
		});
	}

	getSystemInfo(): UniApp.GetSystemInfoResult | WechatMiniprogram.SystemInfo {
		return (
			(this.client?.getSystemInfoSync() as
				| UniApp.GetSystemInfoResult
				| WechatMiniprogram.SystemInfo) || {}
		);
	}

	/**
	 * 获取当前授权权限
	 */
	async getAuthSetting(): Promise<UniApp.AuthSetting | WechatMiniprogram.AuthSetting | string> {
		return new Promise(resolve => {
			this.client?.getSetting({
				success(res: {
					authSetting:
						| string
						| UniApp.AuthSetting
						| WechatMiniprogram.AuthSetting
						| PromiseLike<string | UniApp.AuthSetting | WechatMiniprogram.AuthSetting>;
				}) {
					resolve(res.authSetting);
				},
				fail() {
					resolve('');
				}
			});
		});
	}

	onAppShow(fn: UniApp.OnAppShowCallback | WechatMiniprogram.OnAppShowCallback) {
		this.client?.onAppShow(fn);
	}

	onAppHide(fn: UniApp.OnAppHideCallback | WechatMiniprogram.OnAppHideCallback) {
		this.client?.onAppHide(fn);
	}

	connectSocket(url: string): UniApp.SocketTask | WechatMiniprogram.SocketTask {
		return this.client?.connectSocket({
			url,
			complete: () => ({})
		});
	}
}

export default new UIClient();
