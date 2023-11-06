import { BuildOptions } from 'vite';
import pkg from '../package.json';
export default function getBuildConfig(): BuildOptions {
	return {
		lib: {
			entry: {
				'mp-uni/index': './src/entry/mp-uni.ts',
				'mp-uni-vue2/index': './src/entry/mp-uni-vue2.ts',
				'mp-weixin/index': './src/entry/mp-weixin.ts'
			},
			name: pkg.name,
			// the proper extensions will be added
			fileName: (formast, entryName) => `${entryName}.${formast}.js`
		},
		rollupOptions: {
			output: {
				// disable warning on packages/index.ts using both default and named expor
				exports: 'named',
				manualChunks: id => {
					if (id.includes('node_modules')) {
						return 'vendor';
					} else {
						return 'common';
					}
				}
			}
		}
	};
}
