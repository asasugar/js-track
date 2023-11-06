/*
 * @Description: 数据SDK /基础能力 /生命周期管理
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-08-22 17:56:58
 */

import SDKConfig from '@/config';
import uploadService from '@/upload';
import loggerService from '@/foundation/logger';
import type { SdkBaseConfigOptions } from '#/global';
class SDK {
  async init(config: SdkBaseConfigOptions) {
    // 配置初始化
    const c = SDKConfig.init(config);
    // 日志控制
    if (!c.debug) {
      loggerService.offAction();
    }
    // 获取系统信息和网络状态
    SDKConfig.initSystem();

    // 上传模块初始化
    uploadService.init(c);
  }

  clear() {
    uploadService.clear();
  }
}

export default new SDK();
export * from '../../collect';
export * from '../../message';
