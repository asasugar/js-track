// 扩展uniapp的类型
declare namespace UniNamespace {
	interface SocketTask {
		readyState: number | Uni;
	}

	interface GetSystemInfoResult {
		benchmarkLevel?: number;
	}
}
