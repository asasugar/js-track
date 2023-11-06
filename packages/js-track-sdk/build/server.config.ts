import { ServerOptions } from 'vite';

export default function getServerConfig(): ServerOptions {
	return {
		host: true,
		port: 9999,
		fs: {
			strict: false // link 调试时候设置为false
		},
		hmr: true
	};
}
