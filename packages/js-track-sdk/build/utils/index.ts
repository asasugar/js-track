import { resolve } from 'path';
import { loadEnv } from 'vite';

export function pathResolve(dir: string) {
	return resolve(process.cwd(), '.', dir);
}

export function getClient(mode: string) {
	const command = loadEnv(mode, process.cwd(), '');
	const client = command.CLIENT;
	return client;
}
