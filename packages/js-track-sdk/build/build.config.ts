import type { BuildOptions } from 'vite';
import pkg from '../package.json';
import { getClient } from './utils';

export default function getBuildConfig(mode: string): BuildOptions {
	const client = getClient(mode);
	return {
		outDir: `dist/${client}`,
		lib: {
			entry: `./src/entry/${client}.ts`,
			name: pkg.name,
			// the proper extensions will be added
			fileName: (formast, entryName) => `${entryName}.${formast}.js`,
			formats: ['es', 'umd']
		},
		rollupOptions: {
			output: {
				// disable warning on packages/index.ts using both default and named export
				exports: 'named'
			}
		}
	};
}
