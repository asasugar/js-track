/**
 * 端：uni、wx、brower
 */
// import logger from '@js-track/foundation/logger';
export class UiClient {
  request(params:any) {

  }

  getLocalSync(key: string) {
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
    return '';
  }

  async getNetworkType(): Promise<string> {
    return ''
  }

  getSystemInfo() {
  }

  /**
   * 获取当前授权权限
   */
  async getAuthSetting(): Promise<string> {
   return ''
  }
}

export default new UiClient();
