import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		utils: 'utils/index.ts'
	},
	clean: true,
	dts: true,
	outDir: 'dist',
	format: ['cjs', 'esm']
});
