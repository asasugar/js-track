/*
 * @Description: 数据压缩/解压 加密/解密
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-11-01 14:23:36
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-10-18 15:09:12
 */

import { Base64 } from 'js-base64'; // 加密
import pako from 'pako'; //压缩

/**
 * 压缩加密
 */
export function gzipEn(message: string) {
	// 数据压缩
	const uint8Array = pako.gzip(message);
	// 数据加密
	const base64 = Base64.fromUint8Array(uint8Array);
	return base64;
}

/**
 * 解压解密
 */
export function ungzipDe(base64: string) {
	// 数据解密
	const uint8Array = Base64.toUint8Array(base64);
	// 数据解压
	const message = pako.ungzip(uint8Array, { to: 'string' });
	return message;
}
