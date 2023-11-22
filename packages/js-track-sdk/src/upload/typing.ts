// 根据接口定义调整声明
export interface UploadParams {
	data: string;
}
export interface UploadHeaders {
	['content-type']: string;
}
export interface HttpRes {
	code: 0 | 1;
	msg: string;
	status: string;
	data: string | null;
}
export interface SocketRes {
	batch: boolean;
	code: -1 | 0;
	data: string;
	msg: string;
	eventTime?: number;
	index?: number;
}
