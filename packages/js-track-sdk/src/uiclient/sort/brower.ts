/**
 * web端
 */
// import logger from '@js-track/foundation/logger';

class Brower {
  request(params) {

  }


  getLocal(key: string) {

  }

  setLocalSync(key: string, value: string | number | boolean | AnyObject) {
  }

  setLocal(key: string, value: any) {

  }

  removeLocalSync(key: string) {
  }

  removeLocal(key: string) {

  }

  clearLocal(isSync = true) {

  }

  /**
   * 系统
   * 获取当前Top页面路径
   */
   getTopPageName(): string {
    return ''

  }

  async getNetworkType(): Promise<string> {
    return ''
  }

  getSystemInfo() {
  }
}

export default new Brower();
