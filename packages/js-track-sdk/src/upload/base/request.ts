/*
 * @Description: request 请求
 * 单个数据上传
 * 批量上传
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-06 14:36:29
 */

import Config from '@/config';
import logger from '@/foundation/logger';
import uiClient from '@js-track/platform-api';
import { isFunction } from '@js-track/shared/utils';
import type { UploadParams } from '../typing';

export class RequestCore {
	/**
	 * 系统request
	 * @param {Object} config
	 */
	async mini(
		config:
			| UniApp.RequestOptions
			| WechatMiniprogram.RequestOption<string | WechatMiniprogram.IAnyObject | ArrayBuffer>
	) {
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
			const response = await uiClient.request({
				url,
				method,
				data,
				// 微信
				header,
				// 支付宝
				// headers: header,
				dataType
			});
			logger.info('埋点请求链接:', url, '参数:', data, '返回值:', response);

			return response;
		} catch (e) {
			logger.error('requestCoreMini error', e);
		}
	}

	/**
	 * 单个数据上传
	 * @param {Object} data
	 * @param {Object} headers
	 */
	async insert(data: UploadParams, header: AnyObject) {
		const { domain } = Config.config;

		if (!domain) {
			throw new Error('domain is empty');
		}

		const url = '/xxx/track/Insert';
		// logger.info('单个埋点插入请求头:', header);
		const content = await this.mini({
			url: domain + url,
			data,
			header
		});
		return content;
	}

	/**
	 * 批量上传
	 * @param {Object} data
	 * @param {Object} headers
	 */
	async batchInsert(data: UploadParams, header: AnyObject) {
		const { domain } = Config.config;

		if (!domain) {
			throw new Error('domain is empty');
		}

		const url = '/xxxx/track/batchInsert';
		// logger.info('批量埋点插入请求头:', header);

		const content = await this.mini({
			url: domain + url,
			data,
			header
		});
		return content;
	}
}

export default new RequestCore();
