/**
 * 端：uni、wx、my
 */
// import logger from '@js-track/foundation/logger';
import { isFunction } from '@js-track/utils/is';

class Uni {
  request(params: UniApp.RequestOptions) {
    return new Promise((resolve, reject) => {
      if (!params) return reject(new Error('params is empty'));

      if (!isFunction(params.success)) {
        params.success = function (content) {
          resolve(content);
        };
      }
      if (!isFunction(params.fail)) {
        params.fail = function (e) {
          reject(e);
        };
      }
      if (!isFunction(params.complete)) {
        params.complete = function (content) {
          resolve(content);
        };
      }
      return uni.request(params);
    });
  }

  getLocalSync(key: string) {
    return uni.getStorageSync(key);
  }

  getLocal(key: string) {
    return new Promise((resolve) => {
      try {
        uni.getStorage({
          key,
          success(res: any) {
            resolve(res?.data);
          },
          fail() {
            // throw new Error(e);
            resolve('');
          },
        });
      } catch (e) {
        // logger.error(e);
        resolve('');
      }
    });
  }

  setLocalSync(key: string, value: string | number | boolean | AnyObject) {
    uni.setStorageSync(key, value);
  }

  setLocal(key: string, value: any) {
    return new Promise((resolve, reject) => {
      try {
        uni.setStorage({
          key,
          data: value,
          success() {
            resolve(true);
          },
          fail(e) {
            reject(e);
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  removeLocalSync(key: string) {
    uni.removeStorageSync(key);
  }

  removeLocal(key: string) {
    return new Promise((resolve) => {
      try {
        uni.removeStorage({
          key,
          success(res) {
            return resolve(res);
          },
        });
      } catch (e) {
        // logger.error(e);
      }
    });
  }

  clearLocal(isSync = true) {
    try {
      return uni[`clearStorage${isSync ? 'Sync' : ''}`]();
    } catch (e) {
      // logger.error(e);
      return '';
    }
  }

  /**
   * 系统
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
    return new Promise((resolve) => {
      uni.getNetworkType({
        success(b) {
          resolve(b.networkType);
        },
        fail() {
          resolve('');
        },
      });
    });
  }

  getSystemInfo(): UniApp.GetSystemInfoResult {
    // todo 兼容支付宝&微信
    return uni.getSystemInfoSync();
  }

  /**
   * 获取当前授权权限
   */
  async getAuthSetting(): Promise<UniApp.AuthSetting | string> {
    return new Promise((resolve) => {
      uni.getSetting({
        success(res) {
          resolve(res.authSetting);
        },
        fail() {
          resolve('');
        },
      });
    });
  }
}

export default new Uni();
