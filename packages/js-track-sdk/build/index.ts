/*
 * @Description: Config
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-02-21 17:19:38
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-10 15:44:28
 */
import type { UserConfig } from 'vite';
import getBaseConfig from './base.config';
import getBuildConfig from './build.config';
import getPluginsConfig from './plugins.config';
import getServerConfig from './server.config';

export function getConfig({ mode }: { mode: string }) {
	const Config: UserConfig = getBaseConfig(); // 基础配置
	Config.server = getServerConfig(); // server配置
	Config.build = getBuildConfig(mode); // build配置
	Config.plugins = getPluginsConfig(mode); // 插件配置

	return Config;
}
