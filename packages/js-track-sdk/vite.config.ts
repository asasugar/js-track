import { defineConfig } from 'vite';
import { getConfig } from './build';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return getConfig({ mode });
});
