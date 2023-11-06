// 打包方式：串行(series)  并行(parallel)
import gulp from 'gulp';
import { run, withTaskName } from './utils/index.js';

const { parallel, series } = gulp;
/**
 * 1. 打包平台api
 * 2. 打包工具方法
 * 3. 打包埋点sdk
 * 4. 打包插件
 * 5. 打包埋点文档
 */

export default series(
	withTaskName('build:platform-api', () => run('pnpm run build:platform-api')), // 打包@js-track/platform-api
	withTaskName('build:shared', () => run('pnpm run build:shared')), // 打包@js-track/shared
	// 并行执行sdk打包，文档打包，插件打包
	parallel(
		withTaskName('build:sdk', () => run('pnpm run build:sdk')),
		withTaskName('build:plugins', () => run('pnpm run build:plugins')),
		withTaskName('build:docs', () => run('pnpm run build:docs')),
	),
);
