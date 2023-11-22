/*
 * @Description: request 请求
 * 单个数据上传
 * 批量上传
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-22 15:55:15
 */

import Config from '@/config';
import logger from '@/foundation/logger';
import uiClient from '@js-track/platform-api';
import { isFunction } from '@js-track/shared/utils';
import type { HttpRes, UploadHeaders, UploadParams } from '../typing';
import localService from './local';
export class Request {
	/**
	 * 设置http请求头
	 * @param {Object} commonData
	 */
	getHeader() {
		const header: UploadHeaders = {
			'content-type': 'application/x-www-form-urlencoded'
		};

		return header;
	}
	/**
	 * 系统request
	 * @param {Object} config
	 */
	async mini(config: UniApp.RequestOptions) {
		if (!uiClient.request || !isFunction(uiClient.request)) {
			throw new Error('uiclient.request is empty');
		}
		if (!config || !config.url) {
			throw new Error('config or config.url is empty');
		}
		const { url, method = 'POST', data, dataType } = config;
		let { header } = config;

		header = {
			'content-type': 'application/x-www-form-urlencoded',
			...header
		};
		try {
			const response = (await uiClient.request({
				url,
				method,
				data,
				// 微信
				header,
				// 支付宝
				...(<my.RequestOption['headers']>{ headers: header }),
				dataType
			})) as UniApp.RequestSuccessCallbackResult;
			logger.info('埋点请求链接:', url, '参数:', data, '返回值:', response);

			return response;
		} catch (e) {
			logger.error('requestCoreMini error', e);
		}
	}

	/**
	 * 单个数据上传
	 * @param {Object} data 请求参数
	 * @param {Object} options 扩展参数
	 */
	async insert(data: UploadParams, options?: AnyObject) {
		const { domain } = Config.config;
		console.log(options);
		if (!domain) {
			throw new Error('domain is empty');
		}
		const header = this.getHeader();

		const url = '/xxx/track/Insert';
		const res = await this.mini({
			url: domain + url,
			data,
			header
		});
		const { code } = (res?.data || {}) as HttpRes;

		logger.info(
			`monitor REAL TIME upload ${code === 1 ? 'success' : 'fail'}`,
			data,
			'request_type: http'
		);
	}

	/**
	 * 批量上传
	 * @param {Object} data 请求参数
	 * @param {Object} options 扩展参数
	 */
	async batchInsert(data: UploadParams, options: AnyObject) {
		const { jsonArray, index } = options;

		const { domain } = Config.config;
		console.log(options);

		if (!domain) {
			throw new Error('domain is empty');
		}
		const header = this.getHeader();

		const url = '/xxxx/track/batchInsert';

		const res = await this.mini({
			url: domain + url,
			data,
			header
		});
		const { code } = (res?.data || {}) as HttpRes;
		if (code === 1) {
			// 上传成功后，清空storage
			localService.clearUploadErrorToLocal(index);
		} else {
			// 上传失败后，回写storage
			localService.resetUploadErrorToLocal(JSON.stringify(jsonArray), index);
		}
		logger.info(`monitor upload ${code === 1 ? 'success' : 'fail'}`, 'request_type: http');
	}
}

export default new Request();
