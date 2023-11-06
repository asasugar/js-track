import type { PluginOption } from 'vite';

export default function VitePluginAutoTrack(PageCollectName = 'Bt'): PluginOption {
	// 根据@js-track/sdk dist/common.xxx.js文件打包出来的class名称替换
	const injectCode = `
	if (event?.type === 'message') {
		${PageCollectName}?.h5WebCollect(event,instance);
	} else if (Bt?.isAutoCollectEvent(event)) {
		${PageCollectName}?.autoCollect(event,instance)
	}
`;
	return {
		name: 'vite-plugin-auto-track',
		renderChunk(code, chunk) {
			let tempCode = code;
			if (chunk.fileName === 'common/vendor.js') {
				const regx1 = new RegExp(/patchMPEvent\(e\)/);
				const regx2 = new RegExp(/patchMPEvent\(event\) {([\s\S]*)/);
				tempCode = code.replace(regx1, 'patchMPEvent(e,instance)').replace(
					regx2,
					`patchMPEvent(event,instance){
          ${injectCode};
        $1`
				);
			}
			return {
				code: tempCode,
				map: null // 表示源码视图不作修改
			};
		}
	};
}
