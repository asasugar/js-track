/**
 * 生成UUID
 */
export function generateUUID(format: string, prefix?: string): string {
	let d = new Date().getTime();
	const uuid = format.replace(/[xy]/g, function (c) {
		const r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
	return !prefix ? uuid : prefix + uuid;
}

export { default as aop } from './aop';
export { default as EventSub } from './event';
export * from './is';
export * from './logger';
