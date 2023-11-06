import { UserConfig } from 'vite';
import { pathResolve } from './utils';

export default function getBaseConfig() {
	const baseConfig: UserConfig = {
		root: process.cwd(),
		json: {
			namedExports: true,
			stringify: false
		},
		resolve: {
			alias: [
				// @/xxxx => src/xxxx
				{
					find: '@',
					replacement: pathResolve('src') + '/'
				}
			],
			extensions: ['.js', '.ts', '.json']
		},
		optimizeDeps: {
			force: false // 是否强制依赖预构建，而忽略之前已经缓存过的、已经优化过的依赖
		}
	};
	return baseConfig;
}
