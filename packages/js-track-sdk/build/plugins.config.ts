import { visualizer } from 'rollup-plugin-visualizer';
import { splitVendorChunkPlugin, type PluginOption } from 'vite';

export default function getPluginsConfig(mode: string) {
	const plugins: PluginOption[] = [splitVendorChunkPlugin()];
	if (mode === 'analyzer') {
		plugins.push(
			visualizer({
				open: true
			}) as PluginOption
		);
	}

	return plugins;
}
