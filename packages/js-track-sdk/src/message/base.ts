/*
 * 上报数据结构
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-09-08 17:49:39
 */
import {
    SystemOptions,
    TrackParmas,
} from '#/global';
import Config from '@js-track/config';
import uiclient from '@js-track/uiclient';
import { generateUUID } from '@js-track/utils';
import { isFunction } from '@js-track/utils/is';

class BaseMessage {
  init(): TrackParmas {
    const { sdkVersion, miniversion, networkType , appName} = Config.config;

    return {
      app_version: miniversion,
      app_name: appName,
      sdk_version: sdkVersion,
      // 某一次应用打开到关闭生命周期内的id
      lifecycle_id: this.getLifecycleId(),
      // 产生事件的时间-时间戳，毫秒级
      event_time: `${Date.now()}`,
      // 系统授权用户登录时产生的id，capi对应的是uid
      token_id: this.getBusinessInterface('getTokenId') as string,
      // 用户手机号/登录Id
      login_id: this.getBusinessInterface('getLoginId') as string,
      // 用户userId
      user_id: this.getBusinessInterface('getUserId') as string,
      // 当前页面Code（程序最上层页面）
      current_page_code: uiclient.getTopPageName(),
      // 系统信息
      ...this.transformSystemInfo(),
      upload_id: '',
      network_type: networkType,
      event_code: '',
      /**
       * 事件类别
       * 1.用户行为触发事件(action)
       * 2.App自动类事件(auto)；（比如：曝光、banner轮播等）
       * 3.页面浏览事件(pv)
       * 4.启动关闭类
       * 5.App接收回调后触发
       * 6.调试监控类(debug/monitor)；（比如：APM信息、调试事件、Crash等）
       */
      event_type: '',
      /**
       * 埋点类别
       * 1 无痕埋点
       * 2 手工埋点
       */
      track_type: '',
      // 事件属性（标准化map里的key的名字，尽量复用）
      properties: {},
      // todo 登陆状态
      loginStatus: false,
      // 路径跟踪串
      spm: '',
    };
  }

  /**
   * 获取用户接口数据
   * @param {*} attr
   */
  getBusinessInterface(attr: string): unknown {
    const { businessInterface } = Config.config;
    return isFunction(businessInterface[attr]) ? businessInterface[attr]() : '';
  }

  /**
   * 系统信息
   * @param {*} systemInfo
   */
  transformSystemInfo(systemInfo?: AnyObject): SystemOptions {
    const {
      platform: os_type,
      system: os_version,
      version: wx_version,
      SDKVersion: wx_sdk_version,
      model,
      screenHeight: screen_height,
      screenWidth: screen_width,
      brand: manufacturer,
      language: system_language,
      deviceId: sm_device_id,
    } = systemInfo || uiclient.getSystemInfo();
    return {
      /**
       * 硬件操作系统类别
       * android、
       * ios、
       * windows、
       * Linux
       */
      os_type,
      // 系统版本
      os_version,
      // 微信版本
      wx_version,
      // 微信客户端基础库版本
      wx_sdk_version,
      // 设备型号
      model,
      // 屏幕高度
      screen_height,
      // 屏幕宽度
      screen_width,
      // 厂商
      manufacturer,
      // 系统语言
      system_language,
      // 设备id
      sm_device_id,
    };
  }


  /**
   * 某一次应用打开到关闭生命周期内的id
   */
  getLifecycleId(): string {
    return generateUUID(Config.config.lifecycleIdFormat);
  }
}

export default new BaseMessage();
