/*
 * 持久化存储
 * 1.异步存储失败重试
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-09-08 18:11:31
 */

import { isString } from '@js-track/utils/is';

interface LocalOptions {
  localKey?: string;
  separator?: string;
  needRetryTimes?: number;
}

import type { TrackParmas } from '#/global';
import uiclient from '@js-track/uiclient';

export class Local {
  localKey: string;
  separator: string;
  needRetryTimes: number;
  constructor(opts?: LocalOptions) {
    const {
      localKey = '',
      separator = '%%mpdata%%',
      needRetryTimes = 1,
    } = opts || {};
    this.localKey = localKey;
    this.separator = separator; // Local本地缓存分隔符
    this.needRetryTimes = needRetryTimes; // 异步存储默认重试次数1
  }

  /**
   * 同步获取本地存储数据
   */
  getLocal(localKey: string): string {
    const res = uiclient.getLocalSync(localKey);
    return res;
  }

  /**
   * 存储数据至本地
   */
  async save(localKey: string, list: (TrackParmas | string)[]) {
    if (!list || !list.length) throw new Error('list is empty');
    let tempStr = this.getLocal(localKey) || '';
    // logger.info('saveLocal origin data tempStr 1', tempStr);
    list.forEach((item) => {
      item = isString(item) ? item : JSON.stringify(item);

      tempStr += tempStr ? this.separator + item : item;
    });
    const res = await this.saveAsync(localKey, tempStr, this.needRetryTimes);
    return res;
  }

  /**
   * 清除本地缓存
   */
  async clear(localKey?: string) {
    localKey = localKey || this.localKey;
    const res = await this.saveAsync(localKey, '', this.needRetryTimes);
    return res;
  }

  /**
   * 异步存储
   * 存储失败，默认重试一次。
   * @params
   *  storageKey
   *  content
   *  needRetryTimes 重试的次数
   */
  async saveAsync(
    storageKey: string,
    content: any,
    needRetryTimes: number
  ): Promise<unknown> {
    if (!storageKey) return null;
    try {
      const res = await uiclient.setLocal(storageKey, content);
      return res;
    } catch (err) {
      if (needRetryTimes) {
        needRetryTimes--;
        return this.saveAsync(storageKey, content, needRetryTimes);
      }
      return null;
    }
  }
}

export default new Local();
