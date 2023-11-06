/*
 * @Description: 数据缓存
 * 类型：临时缓存 & 持久化缓存
 * 定量定时：
 * 临时缓存最大20条
 * 每隔8秒同步到本地local
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-09-11 18:22:35
 */

import type { SdkBaseConfigOptions, TrackParmas } from '#/global';
import {
  CACHE_TO_STORAGE_JSTRACKSDK,
  STORAGE_UPLOAD_ERROR_JSTRACKSDK,
} from '@js-track/constant/localKey';
import { EventSub } from '@js-track/foundation';
import logger from '@js-track/foundation/logger';
import uiclient from '@js-track/uiclient';
import { isUnDef } from '@js-track/utils/is';

export class UploadLocal extends EventSub {
  cache: (TrackParmas | string)[] = []; // 临时缓存【最大值20条】
  uploadLocalMax: number = 20; // 临时缓存&持久化缓存 存储最大条数
  interval: number = 8 * 1000; // 每隔8秒从将缓存数据存入本地local
  saveTimer: null | NodeJS.Timeout = null; // 每隔指定时间，将缓存数据保存至Store
  saveStorageErrorTimes: number = 0; // 由Catch存储至Local报错次数
  cacheLimitMaxTimes: number = 0; // 临时缓存超限次数
  stopFlag: boolean = false;

  localKey: string =''; // 持久化缓存
  separator: string = '%%jsTrackSdk%%'; // 持久化缓存分隔符
  needRetryTimes: number =1;// 异步存储默认重试次数1
  stop() {
    this.stopFlag = true;
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
  }

  /**
   * 初始化
   * 设置上传的最大条数
   * @param {*} config
   */
  start(config: SdkBaseConfigOptions) {
    const { saveStoreInterval, maxStoreCacheSize, separator } = config || {};
    separator && (this.separator =  separator );
    maxStoreCacheSize && (this.uploadLocalMax = maxStoreCacheSize);
    saveStoreInterval && (this.interval = saveStoreInterval);
    this.startLocalTimer();
    this.stopFlag = false;
  }

  /**
   * 临时缓存数据
   * @param {*} msg
   */
  save(msg: TrackParmas | string) {
    if (this.cache.length < this.uploadLocalMax) {
      this.cache.push(msg);
    } else {
      this.cacheLimitMaxTimes++;
    }
  }

  /**
   * 将临时数据持久化
   */
  async saveCacheToCache() {
    if (!this.cache || !this.cache.length) return;

    try {
      await this.local.save(CACHE_TO_STORAGE_JSTRACKSDK, this.cache);
      this.clearCache();
    } catch (err: any) {
      this.saveStorageErrorTimes++;
      if (this.saveStorageErrorTimes > 10) {
        this.clearAll();
        this.saveStorageErrorTimes = 0;
      }
      this.emit('error', {
        errorCode: 'saveTimerError',
        data: {
          stack: JSON.stringify(err.stack),
        },
      });
    }
  }

  /**
   * 定时器
   * 将数据从cache保存到local
   */
  startLocalTimer() {
    // logger.info('JSTRACKSDK CACHE TO LOCAL TIMER START!!!');
    if (!this.saveTimer && !this.stopFlag) {
      this.saveTimer = setTimeout(async () => {
        // logger.info('JSTRACKSDK CACHE TO LOCAL!!!');
        await this.saveCacheToCache();
        this.saveTimer = null;
        this.startLocalTimer();
      }, this.interval);
    }
  }

  /**
   * 获取持久缓存数据
   */
  getLocal() {
    return this.local.getLocal(CACHE_TO_STORAGE_JSTRACKSDK);
  }

  /**
   * 清除数据
   * 1.持久缓存容器
   * 2.临时缓存容器
   */
  async clearAll() {
    await this.clearLocal();
    this.clearCache();
  }

  async clearLocal() {
    try {
      await this.local.clear(CACHE_TO_STORAGE_JSTRACKSDK);
    } catch (e) {
      this.emit('error', {
        errorCode: 'clear_local_failed',
      });
    }
  }

  /**
   * 清除临时缓存
   */
  clearCache() {
    this.cache = [];
  }

  /**
   * 上传失败会将数据存回持久化容器
   * local key: STORAGE_UPLOAD_ERROR_JSTRACKSDK + x
   */

  /**
   * 获取上传失败存储的数据
   * @params index 序号
   */
  getUploadErrorToLocal(index: number) {
    const uploadKey = STORAGE_UPLOAD_ERROR_JSTRACKSDK + index;
    return this.local.getLocal(uploadKey);
  }

  /**
   * 清空UploadArray中的数据
   */
  async clearUploadErrorToLocal(index?: number) {
    if (isUnDef(index)) return;
    const uploadKey = STORAGE_UPLOAD_ERROR_JSTRACKSDK + index;
    try {
      await uiclient.removeLocal(uploadKey);
      // await this.local.clear(uploadKey);
    } catch (e) {
      this.emit('error', {
        errorCode: 'clear_upload_array_failed',
      });
    }
  }

  /**
   * 重置UploadArray中的数据
   */
  resetUploadErrorToLocal(messages: string, index?: number) {
    if (index !== undefined) {
      this.saveUploadErrorToLocal(messages, index);
    } else {
      for (let i = 0; i < this.uploadLocalMax; i++) {
        if (!this.getUploadErrorToLocal(i)) {
          this.saveUploadErrorToLocal(messages, i);
          break;
        }
      }
    }
  }

  /**
   * 持久化缓存UploadErrorArray的数据
   */
  async saveUploadErrorToLocal(messages: string, index: number) {
    logger.info('saveUploadErrorToLocal:', index, '---messages---', messages);
    const uploadKey = STORAGE_UPLOAD_ERROR_JSTRACKSDK + index;
    try {
      await this.local.saveAsync(uploadKey, messages, 2);
    } catch (e) {
      this.emit('error', {
        errorCode: 'save_upload_array_failed',
      });
    }
  }
}

export default new UploadLocal();
