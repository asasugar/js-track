import { visualizer } from 'rollup-plugin-visualizer';
import { splitVendorChunkPlugin, type PluginOption } from 'vite';
import viteProgressBar from 'vite-plugin-progress';
export default function getPluginsConfig(mode: string) {
	const plugins: PluginOption[] = [viteProgressBar(), splitVendorChunkPlugin()];
	if (mode === 'analyzer') {
		plugins.push(
			visualizer({
				open: true
			}) as PluginOption
		);
	}

	return plugins;
}
