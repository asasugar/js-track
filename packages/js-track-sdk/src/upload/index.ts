/*
 * @Description: 数据上报
 * 1.压缩
 * 2.加密
 * 3.缓存
 * 4.持久化
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-09-08 18:30:51
 */
import collectService from '@js-track/collect/event';
import Config from '@js-track/config';
import { UPLOAD_ID_JSTRACKSDK } from '@js-track/constant/localKey';
import logger from '@js-track/foundation/logger';
import uiclient from '@js-track/uiclient';
import { Base64 } from 'js-base64'; // 加密
import pako from 'pako'; //压缩
import localService from './base/local';

import type { SdkBaseConfigOptions, TrackParmas } from '#/global';
import { isDef } from '@js-track/utils/is';
import requestService from './base/request';
import type { UploadParams } from './typing';

export class Upload {
  uploadId: number = 0;
  uploadFlag: boolean[] = [];
  interval: number = 30000; // 每隔30秒上传
  uploadTimer: null | NodeJS.Timeout = null;
  uploadErrorTimes: number = 0;
  maxUploadIndex: number = 20; // 上传存储最大空间

  /**
   * 清理内存数据
   * app onHide
   */
  clear() {
    if (this.uploadTimer) {
      clearTimeout(this.uploadTimer);
      this.uploadTimer = null;
    }
    localService.fire();
    localService.stop();
  }

  /**
   * 初始化
   * @param {*} config
   */
  init(config: SdkBaseConfigOptions): void {
    const { uploadInterval, maxUploadIndex } = config || {};
    uploadInterval && (this.interval = uploadInterval);
    maxUploadIndex && (this.maxUploadIndex = maxUploadIndex);

    // 监听localService的错误事件
    localService.on(
      'error',
      (content: { eventCode: string; data: AnyObject }) => {
        if (!content) return;
        const { eventCode, data } = content;
        collectService.event(eventCode, data, Config.eventType.APM);
      }
    );
    localService.start(config);

    this.startTimer();
  }

  save(msg: TrackParmas | string) {
    localService.save(msg);
  }

  /**
   * 定时器
   */
  startTimer() {
    // logger.info('JSTRACKSDK UPLOADER TIMER START');
    if (!this.uploadTimer) {
      this.uploadTimer = setTimeout(() => {
        try {
          // logger.info('JSTRACKSDK UPLOADER');
          this.uploadTimerHandle();
        } catch (err) {
          logger.info('uploadTimerError', err);
          this.uploadErrorTimes++;
          if (this.uploadErrorTimes > 5) {
            localService.clearLocal();
            this.uploadErrorTimes = 0;
            collectService.event(
              'uploadTimerError',
              {
                stack: JSON.stringify((err as Error).stack),
              },
              Config.eventType.APM
            );
          }
        } finally {
          this.uploadTimer = null;
          this.startTimer();
        }
      }, this.interval);
    }
  }

  /**
   * 上传local中的数据
   */
  uploadTimerHandle() {
    // 上传Local中的数据
    const uploadStr = localService.getLocal();
    // logger.info('uploadMessage uploadStr---', uploadStr);
    if (!uploadStr) return;
    localService.clearLocal();
    const msgArray = uploadStr.split(localService.local.separator);

    let tempArray: string[] = [];
    msgArray.forEach((item) => {
      tempArray.push(item);
      if (tempArray.length === localService.uploadLocalMax) {
        this.sendBatch(`[${tempArray.toString()}]`);
        tempArray = [];
      }
    });
    // 没有超过最大条数限制
    if (tempArray.length) {
      this.sendBatch(`[${tempArray.toString()}]`);
    }

    // 上传UploadErrorArray中的数据
    for (let i = 0; i < this.maxUploadIndex; i++) {
      const messages = localService.getUploadErrorToLocal(i);
      if (messages) {
        if (!this.uploadFlag[i]) {
          this.uploadFlag[i] = true;
          this.sendBatch(messages, i);
        }
      }
    }
  }

  /**
   * 上传动作id
   */
  getUploadId() {
    if (this.uploadId <= 0) {
      const localId = uiclient.getLocalSync(UPLOAD_ID_JSTRACKSDK);
      this.uploadId = Number(localId) || 0;
    }
    const uploadId = ++this.uploadId;
    if (uploadId % 3 === 0) {
      uiclient.setLocalSync(UPLOAD_ID_JSTRACKSDK, uploadId);
    }
    this.uploadId = uploadId;
    return `${uploadId}`;
  }

  /**
   * 实时上传数据
   */
  async send(data: TrackParmas) {
    // logger.log('send------- data:', data);
    data.upload_id = this.getUploadId();
    // logger.info('send------- upload_id:', data.upload_id);
    // 有自定义header需求自行补充
    let header: AnyObject = {
    };

    const dataStr = JSON.stringify(data);
    const { appKey } = Config.config;
    // 数据压缩
    const zipStr = pako.gzip(dataStr);
    // 数据加密
    const msgStrsEn = Base64.fromUint8Array(zipStr);
    const params: UploadParams = {
      appKey,
      data: msgStrsEn,
    };

    let res;
    try {
      res = await requestService.insert(params, header);
      // logger.info('JSTRACKSDK REALTIME UPLOAD SUCCESS', res);
    } catch (e) {
      // 进入临时缓存
      localService.save(dataStr);
      res = null;
    }
    return res;
  }

  /**
   * 批量延迟上传数据
   */
  async sendBatch(data: string, index?: number) {
    // logger.log('update index send --- ', data, 'index---', index);
    let jsonArray: TrackParmas[] = [];
    try {
      jsonArray = JSON.parse(data);
      // logger.info('update index send --- JSON.parse', jsonArray);
      jsonArray = jsonArray.map((item: TrackParmas) => {
        if (!item.upload_id) {
          item.upload_id = this.getUploadId();
        }
        return item;
      });
      // logger.info('update index send --- jsonArray, getUploadId', jsonArray);
      // 提取commonData
      const bothData = this.formatData(jsonArray);
      // logger.info('update index send --- bothData', bothData);
      if (!bothData) {
        if (isDef(index)) {
          this.uploadFlag[index] = false;
        }
        return;
      }
      const { appKey } = Config.config;

      // 数据压缩
      const zipStr = pako.gzip(bothData);
      // 数据加密

      const msgStrsEn = Base64.fromUint8Array(zipStr);
      // logger.info('send  params ---- msgStrsEn', msgStrsEn);

      const params: UploadParams = {
        appKey,
        data: msgStrsEn,
      };
      const header: AnyObject = {
      };

      // logger.info('send  params ---- ', params);
      let res;
      try {
        res = await requestService.batchInsert(params, header);
        const { code, msg } = (res && (res as any).data) || {};
        if (code === 1) {
          // 上传成功后，清空storage
          localService.clearUploadErrorToLocal(index);
          // logger.info('JSTRACKSDK UPLOAD SUCCESS', msg, res);
        } else {
          logger.error(
            'JSTRACKSDK UPLOAD FAIL',
            msg || (res && (res as any).errMsg),
            res
          );
          // 上传失败后，回写storage
          localService.resetUploadErrorToLocal(
            JSON.stringify(jsonArray),
            index
          );
        }
      } catch (err) {
        // todo 上传失败后，回写storage
        logger.error('JSTRACKSDK UPLOAD FAIL', JSON.stringify(err));
        // 上传失败后，回写storage
        localService.resetUploadErrorToLocal(JSON.stringify(jsonArray), index);
        res = null;
      }
    } catch (err) {
      // todo 缓存错误
      logger.error('JSTRACKSDK UPLOAD FAIL', JSON.stringify(err));
      // 上传失败后，回写storage
      localService.resetUploadErrorToLocal(JSON.stringify(jsonArray), index);
    } finally {
      if (isDef(index)) {
        this.uploadFlag[index] = false;
      }
    }
  }

  /**
   * todo 优化数据类型
   * 批量数据上传
   * 按照hmonitor api格式，提取commonData 和 especialData
   * @return
   *  {JSON} commonData 当前上传列表中的通用数据[系统信息、app信息等]
   *  {JSONArray} especialData 上传事件中除commonData外的其他信息
   *    例如：页面信息
   *         操作信息、
   *         异常信息、
   *         递增id、
   *         事件信息等
   *
   */
  formatData(arr: TrackParmas[]) {
    if (!arr || !arr.length) return '';
    // 提取Common字段
    const commonData: AnyObject = {};
    let isCommon = true;
    const firstJson = arr[0];
    const firstJsonKeys = Object.keys(firstJson);
    firstJsonKeys.forEach((key) => {
      isCommon =
        arr.findIndex((i) => {
          return (
            i[key as keyof TrackParmas] !== firstJson[key as keyof TrackParmas]
          );
        }) < 0;
      if (isCommon) {
        commonData[key] = firstJson[key as keyof TrackParmas];
      }
    });

    // 过滤common
    const especialData: AnyObject[] = [];
    arr.forEach((item) => {
      const especialJson: AnyObject = {};
      const keys = Object.keys(item);
      keys.forEach((key) => {
        if (commonData[key] !== item[key as keyof TrackParmas]) {
          especialJson[key] = item[key as keyof TrackParmas];
        }
      });
      especialData.push(especialJson);
    });

    const data: AnyObject = {};
    data.commonData = commonData;
    data.especialData = especialData;

    // logger.log('upload data', data);
    return JSON.stringify(data);
  }
}

export default new Upload();
