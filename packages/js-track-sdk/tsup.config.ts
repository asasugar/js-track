import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		'mp-uni': './src/entry/mp-uni.ts',
		'mp-uni-vue2': './src/entry/mp-uni-vue2.ts',
		'mp-weixin': './src/entry/mp-weixin.ts'
	},
	clean: true,
	dts: true,
	outDir: 'dist/types',
	format: 'esm'
});
