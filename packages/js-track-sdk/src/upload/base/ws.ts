import SDKConfig from '@/config';
import logger from '@/foundation/logger';
import uiClient from '@js-track/platform-api';
import type { UploadParams } from '../typing';

const HEALTHCHECK_MAXCOUNT = 3;
const HEALTHTIME = 10 * 1000;
const RECONNECT_INTERVAL = 5 * 1000;
const SOCKETTASK_ERROR_MAXCOUNT = 3;

class Socket {
	socketTask: UniApp.SocketTask | WechatMiniprogram.SocketTask | undefined; // socketTask对象
	sendMessageTimestamp: number = new Date().getTime(); // 客户端发送消息的时间戳
	timerId: Timer = null;
	socketTaskErrorCount = 0; // onError次数
	socketTaskErrorReconnectTime: number = RECONNECT_INTERVAL; // 重连间隔时间
	healthTime: number = HEALTHTIME; // 心跳频率（避免被nginx自动断开）
	healthCheckRetryCount: number = HEALTHCHECK_MAXCOUNT; // 心跳检测重试次数
	insertCb: Function | null = null; // 单条请求接口回调
	batchInsertCb: Function | null = null; // 批量请求接口回调

	/**
	 * 是否可以使用ws上报
	 */
	canIUseWS() {
		const { request_type } = SDKConfig.config;
		console.log(
			'=========>canIUseWs',
			request_type === 'ws' && this.socketTask?.readyState === 1,
			request_type,
			this.socketTask
		);
		return request_type === 'ws' && this.socketTask?.readyState === 1;
	}

	async init() {
		this.close();
		this.connect();
		this.emit();
	}
	/**
	 * 连接ws
	 */
	connect() {
		const { wsDomain } = SDKConfig.config;

		if (!wsDomain) {
			throw new Error('domain is empty');
		}
		this.socketTask = uiClient.connectSocket(wsDomain) as
			| UniApp.SocketTask
			| WechatMiniprogram.SocketTask;
	}

	/**
	 * ws相关事件监听
	 */
	emit() {
		if (!this.socketTask) return;
		// 监听 WebSocket 连接打开事件
		this.socketTask.onOpen(() => {
			// logger.info('埋点ws连接打开:');
			if (this.socketTask?.readyState === 1) {
				this._startHeartbeat();
			}
		});

		// 监听 WebSocket 接收到服务器的消息事件
		this.socketTask.onMessage(result => {
			// 接收到服务端心跳反馈则重置心跳检测
			if (result.data === 'PONG') {
				this._resetHeartbeat();
				// logger.info('埋点ws接收到服务端心跳反馈消息：', this.healthCheckRetryCount);
			} else {
				// logger.info('埋点ws接收到服务端消息：', result);
				const data = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
				if (data.batch) {
					this.batchInsertCb?.(data);
				} else {
					this.insertCb?.(data);
				}
			}
		});

		// 监听 WebSocket 连接关闭事件
		this.socketTask.onClose(res => {
			logger.info('埋点ws关闭：:', res);
			this._stopHeartbeat();
		});

		// 监听 WebSocket 错误事件
		this.socketTask.onError(errMsg => {
			console.log('埋点ws错误：', errMsg);
			// 小程序socket触发错误事件之后，就会主动触发onClose事件
			if (this.socketTaskErrorCount >= SOCKETTASK_ERROR_MAXCOUNT) {
				console.log('埋点ws重连次数已达上限，将自动断开连接！');
				this.close();
				return;
			}
			// 重连机制间隔时间为5s * 2的N次方
			const t = setTimeout(async () => {
				this.socketTaskErrorCount++;
				this._stopHeartbeat();
				// 尝试重新连接
				await this.init();
				console.log(`埋点ws尝试重新连接,第${this.socketTaskErrorCount}次`);
				clearTimeout(t);
			}, this.socketTaskErrorReconnectTime * 2 ** this.socketTaskErrorCount);
		});
	}

	/**
	 * 客户端主动关闭ws连接
	 */
	close() {
		this._stopHeartbeat();
		if (this.socketTask) {
			this.socketTask.close({
				code: 1000,
				reason: 'Mini program close Scoket!'
			});
		}
	}

	/**
	 * 发送消息
	 */
	send({ data, success, fail, complete }: UniApp.SendSocketMessageOptions) {
		if (!this.socketTask) return;
		this.sendMessageTimestamp = new Date().getTime();
		this.socketTask.send({
			data,
			success: result => {
				// logger.info('埋点ws客户端推送消息成功：', result, data);
				success?.(result);
			},
			fail: err => {
				// logger.info('埋点ws客户端推送消息失败：', err, data);
				this._stopHeartbeat();
				fail?.(err);
			},
			complete: result => {
				complete?.(result);
			}
		});
	}

	setInsertCb(fn: Function) {
		this.insertCb = fn;
	}

	setBatchInsertCb(fn: Function) {
		this.batchInsertCb = fn;
	}
	/**
	 * 启动心跳
	 */
	_startHeartbeat() {
		this.timerId = setTimeout(() => {
			this.send({
				data: 'PING',
				success: () => {
					// 心跳检测发送成功,重置检测次数
					this.healthCheckRetryCount = HEALTHCHECK_MAXCOUNT;
				},
				fail: async err => {
					// 心跳检测发送失败，次数-1
					this.healthCheckRetryCount--;
					logger.info('埋点ws心跳检测次数发送失败，检测次数:', this.healthCheckRetryCount, err);
					// 心跳次数剩余0时，重新连接一次
					if (this.healthCheckRetryCount === 0 && this.timerId) {
						await this.init();
					} else if (this.healthCheckRetryCount < 0) {
						// 重连一次失败则关闭ws
						this.close();
					} else {
						this._startHeartbeat();
					}
				},
				complete: () => {
					this._startHeartbeat();
				}
			});
		}, this.healthTime);
	}

	/**
	 * 停止启动心跳
	 */
	_stopHeartbeat() {
		if (this.timerId) {
			clearTimeout(this.timerId);
			this.timerId = undefined;
		}
	}

	/**
	 * 重置心跳检测
	 */
	_resetHeartbeat() {
		this._stopHeartbeat();
		this._startHeartbeat();
	}

	/**
	 * 单个数据上传
	 * @param {UploadParams} params
	 */
	insert({
		params,
		success,
		fail,
		complete
	}: {
		params: UploadParams;
		success?: UniApp.SendSocketMessageOptions['success'];
		fail?: UniApp.SendSocketMessageOptions['fail'];
		complete?: UniApp.SendSocketMessageOptions['complete'];
	}) {
		this.send({
			data: JSON.stringify({
				...params,
				batch: false, // 单条数据上报
				decode: 1 // 采用新的base64加、解密
			}),
			success,
			fail,
			complete
		});
	}

	/**
	 * 批量上传
	 * @param {UploadParams} params
	 * @param {number} index
	 */
	batchInsert({
		params,
		index,
		success,
		fail,
		complete
	}: {
		params: UploadParams;
		index?: number;
		success?: UniApp.SendSocketMessageOptions['success'];
		fail?: UniApp.SendSocketMessageOptions['fail'];
		complete?: UniApp.SendSocketMessageOptions['complete'];
	}) {
		this.send({
			data: JSON.stringify({
				...params,
				batch: true, // 是批量上报数据
				decode: 1, // 采用新的base64加、解密
				index,
				eventTime: new Date().getTime()
			}),
			success,
			fail,
			complete
		});
	}
}
export default new Socket();
