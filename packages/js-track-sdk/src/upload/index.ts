/*
 * @Description: 数据上报
 * 1.压缩
 * 2.加密
 * 3.缓存
 * 4.持久化
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-20 18:36:20
 */
import collectService from '@/collect/event';
import Config from '@/config';
import { UPLOAD_ID_JS_TRACK } from '@/constant/localKey';
import logger from '@/foundation/logger';
import uiclient from '@js-track/platform-api';
import { isDef } from '@js-track/shared/utils';
import localService from './base/local';
import requestService from './base/request';
import { gzipEn, ungzipDe } from './base/safe';
import wsService from './base/ws';

import type { SocketRes, UploadParams } from './typing';

export class Upload {
	uploadId = 0;
	uploadFlag: boolean[] = [];
	interval = 30000; // 每隔30秒上传
	uploadTimer: null | NodeJS.Timeout = null;
	uploadErrorTimes = 0;
	maxUploadIndex = 20; // 上传存储最大空间

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
	async init(config: JTBusiness.SdkBaseConfigOptions) {
		const { uploadInterval, maxUploadIndex, request_type } = config || {};
		if (request_type === 'ws') {
			// socket初始化
			await wsService.init();
		}
		uploadInterval && (this.interval = uploadInterval);
		maxUploadIndex && (this.maxUploadIndex = maxUploadIndex);

		// 监听localService的错误事件
		localService.on('error', (content: { eventCode: string; data: AnyObject }) => {
			if (!content) return;
			const { eventCode, data } = content;
			collectService.event(eventCode, data, Config.eventType.APM);
		});
		localService.start(config);

		this.startTimer();
	}

	save(msg: JTBusiness.MonitorParmas | string) {
		localService.save(msg);
	}

	/**
	 * 定时器
	 */
	startTimer() {
		if (!this.uploadTimer) {
			this.uploadTimer = setTimeout(() => {
				try {
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
								stack: JSON.stringify((err as Error).stack)
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
		msgArray.forEach(item => {
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
			const localId = uiclient.getLocalSync(UPLOAD_ID_JS_TRACK);
			this.uploadId = Number(localId) || 0;
		}
		const uploadId = ++this.uploadId;
		if (uploadId % 3 === 0) {
			uiclient.setLocalSync(UPLOAD_ID_JS_TRACK, uploadId);
		}
		this.uploadId = uploadId;
		return `${uploadId}`;
	}

	/**
	 * 实时上传数据
	 */
	async send(data: JTBusiness.MonitorParmas) {
		data.upload_id = this.getUploadId();

		const dataStr = JSON.stringify(data);
		const msgStrsEn = gzipEn(dataStr);
		try {
			const params: UploadParams = {
				data: msgStrsEn
			};
			// ws / http
			if (wsService.canIUseWS()) {
				// socket请求
				wsService.insert({
					params,
					success: () => {
						wsService.setInsertCb((result: SocketRes) => {
							const deMsg = ungzipDe(result.data);
							if (result.code !== 0) {
								// 进入临时缓存
								localService.save(deMsg);
							}
							logger.info(
								`monitor REAL TIME upload ${result.code === 0 ? 'success' : 'fail'}`,
								JSON.parse(deMsg),
								'request_type: ws'
							);
						});
					},
					fail: () => {
						console.log('埋点ws客户端推送单条消息失败,走http兜底上报', data);
						// 发送失败后，兜底走http上报
						requestService.insert(params);
					}
				});
			} else {
				requestService.insert(params);
			}
		} catch (e) {
			// 进入临时缓存
			localService.save(dataStr);
		}
	}

	/**
	 * 批量延迟上传数据
	 */
	async sendBatch(data: string, index?: number) {
		let jsonArray: JTBusiness.MonitorParmas[] = [];
		try {
			jsonArray = JSON.parse(data);
			jsonArray = jsonArray.map((item: JTBusiness.MonitorParmas) => {
				if (!item.upload_id) {
					item.upload_id = this.getUploadId();
				}
				return item;
			});
			// 提取commonData
			const bothData = this.formatData(jsonArray);
			if (!bothData) {
				if (isDef(index)) {
					this.uploadFlag[index] = false;
				}
				return;
			}

			// 数据压缩加密
			const msgStrsEn = gzipEn(bothData);

			const params: UploadParams = {
				data: msgStrsEn
			};
			const bothDataJson = JSON.parse(bothData || '{}');
			const { commonData } = bothDataJson;

			// ws / http
			if (wsService.canIUseWS()) {
				// socket请求
				wsService.batchInsert({
					params,
					index,
					success: () => {
						wsService.setBatchInsertCb((result: SocketRes) => {
							if (result.code === 0) {
								// 上传成功后，清空storage
								localService.clearUploadErrorToLocal(result.index);
							} else {
								const deMsg = ungzipDe(result.data);
								// 上传失败后，回写storage
								localService.resetUploadErrorToLocal(deMsg, result.index);
							}
							logger.info(
								`monitor upload ${result.code == 0 ? 'success' : 'fail'}`,
								'request_type: ws'
							);
						});
					},
					fail: () => {
						console.log('埋点ws客户端推送批量消息失败,走http兜底上报');
						// 发送失败后，兜底走http上报
						requestService.batchInsert(params, { commonData, jsonArray, index });
					}
				});
			} else {
				requestService.batchInsert(params, { commonData, jsonArray, index });
			}
		} catch (err) {
			logger.error('js-track UPLOAD FAIL', JSON.stringify(err));
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
	formatData(arr: JTBusiness.MonitorParmas[]) {
		if (!arr || !arr.length) return '';
		// 提取Common字段
		const commonData: AnyObject = {};
		let isCommon = true;
		const firstJson = arr[0];
		const firstJsonKeys = Object.keys(firstJson);
		firstJsonKeys.forEach(key => {
			isCommon =
				arr.findIndex(i => {
					return (
						i[key as keyof JTBusiness.MonitorParmas] !==
						firstJson[key as keyof JTBusiness.MonitorParmas]
					);
				}) < 0;
			if (isCommon) {
				commonData[key] = firstJson[key as keyof JTBusiness.MonitorParmas];
			}
		});

		// 过滤common
		const especialData: AnyObject[] = [];
		arr.forEach(item => {
			const especialJson: AnyObject = {};
			const keys = Object.keys(item);
			keys.forEach(key => {
				if (commonData[key] !== item[key as keyof JTBusiness.MonitorParmas]) {
					especialJson[key] = item[key as keyof JTBusiness.MonitorParmas];
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
