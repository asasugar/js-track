// 扩展wx的类型
declare namespace my {
	interface RequestOption {
		/**
		 * 目标服务器 URL
		 * @description
		 * - 目前只支持 HTTPS 协议的请求
		 * - 目前只支持与 *域名白名单* 中的域名通讯
		 *   - 开发过程中，可通过开发者工具 **详情 > 域名信息 > 忽略 httpRequest 域名合法性检查** 忽略该限制（模拟器、预览以及真机调试场景不会校验域名合法性）
		 *   - 正式/体验版本必须在 **支付宝小程序管理中心 > 小程序详情 > 设置 > 开发设置 > 服务器域名白名单** 中配置
		 *   - 域名添加或删除后仅对新版本生效，老版本仍使用修改前的域名配置
		 */
		url: string;
		/**
		 * 返回的数据格式
		 * @default 'json'
		 */
		dataType?: 'base64' | 'json' | 'text' | 'arraybuffer';
		/**
		 * HTTP 请求方法
		 * @default 'GET'
		 */
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'TRACE' | 'CONNECT';
		/**
		 * 传给服务器的数据
		 * @description
		 * 传给服务器的数据最终会是 string 类型，如果 data 不是 string 类型，会被转换成 string 。转换规则如下：
		 * - 若方法为 `GET`，会将数据转换成 querystring 形式： `encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...`
		 * - 若方法为 `POST` 且 `headers['content-type']` 为 `application/json` ，会对数据进行 JSON 序列化。
		 * - 若方法为 `POST` 且 `headers['content-type']` 为 `application/x-www-form-urlencoded` ，会将数据转换成 querystring形式： `encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...`
		 */
		data?: string | Record<string, string> | ArrayBuffer;
		/**
		 * 设置请求的 HTTP 头对象
		 * @description
		 * - "content-type" 字段默认为 `application/json`
		 * - `referer` 字段不可设置，其格式固定为 https://{appid}.hybrid.alipay-eco.com/{appid}/{version}/index.html#{page}，其中 {appid} 为小程序的 APPID，{version} 为小程序发布标识，{page} 为小程序当前页面。
		 */
		headers?: Record<string, string>;
		/**
		 * 设置请求的 HTTP 头对象
		 * @description
		 * - "content-type" 字段默认为 `application/json`
		 * - `referer` 字段不可设置，其格式固定为 https://{appid}.hybrid.alipay-eco.com/{appid}/{version}/index.html#{page}，其中 {appid} 为小程序的 APPID，{version} 为小程序发布标识，{page} 为小程序当前页面。
		 */
		header?: Record<string, string>;
		/**
		 * 超时时间，单位 ms
		 * @default 30000
		 */
		timeout?: number;
		/**
		 * referer 策略
		 * @default 'querystring'
		 */
		referrerStrategy?: string;
		/**
		 * 接口调用成功的回调函数
		 */
		success?(data: RequestSuccessCallbackResult): void;
		/**
		 * 接口调用失败的回调函数
		 */
		fail?(err: RequestFailCallbackErr): void;
		/**
		 * 接口调用结束的回调函数（调用成功、失败都会执行）
		 */
		complete?(
			arg:
				| {
						/**
						 * 响应数据，格式取决于请求时的 `dataType` 参数
						 */
						data: string | Record<string, unknown> | ArrayBuffer;
						/**
						 * HTTP 响应码。
						 */
						status: number;
						/**
						 * HTTP 响应头。
						 */
						headers: Record<string, string>;
						/**
						 * HTTP 响应码。
						 */
						statusCode: number;
						/**
						 * HTTP 响应头。
						 */
						header: Record<string, string>;
				  }
				| (
						| {
								error?: number;
								errorMessage?: string;
						  }
						| {
								error: 19;
								errorMessage: 'http status error';
						  }
						| {
								error: 14;
								errorMessage: 'parse arraybuffer data error';
						  }
						| {
								error: 14;
								errorMessage: 'JSON parse data error';
						  }
				  )
		): void;
	}
	interface RequestSuccessCallbackResult {
		/**
		 * 响应数据，格式取决于请求时的 `dataType` 参数
		 */
		data: string | Record<string, unknown> | ArrayBuffer;
		/**
		 * HTTP 响应码。
		 */
		status: number;
		/**
		 * HTTP 响应头。
		 */
		headers: Record<string, string>;
		/**
		 * HTTP 响应码。
		 */
		statusCode: number;
		/**
		 * HTTP 响应头。
		 */
		header: Record<string, string>;
	}

	type RequestFailCallbackErr =
		| {
				error?: number;
				errorMessage?: string;
		  }
		| {
				error: 19;
				errorMessage: 'http status error';
		  }
		| {
				error: 14;
				errorMessage: 'parse arraybuffer data error';
		  }
		| {
				error: 14;
				errorMessage: 'JSON parse data error';
		  };
}
