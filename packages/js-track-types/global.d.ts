// 自定义类型
type RefType<T> = T | null;
type Nullable<T> = T | null;
type Undefinable<T> = T | undefined;
type NumericalBoolean = 0 | 1;
type EventVoidFunction = (e: Event) => void;
type TypeFunction<T> = () => T;
type NP<T> = Promise<T | null>;
type UP<T> = Promise<T | undefined>;
type NUP<T> = Promise<T | undefined | null>;
type Timer = undefined | null | string | number | NodeJS.Timeout;
type Simplify<T> = {
	[P in keyof T]: T[P];
};
/** 设置接口属性为可选 */
type SetOptional<T, K extends keyof T> = Simplify<
	Partial<Pick<T, K>> & Pick<T, Exclude<keyof T, K>>
>;
/** 设置接口属性为必选 */
type SetRequired<T, K extends keyof T> = Simplify<
	Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
>;
interface IEvent {
	changedTouches: [
		{
			clientX: number;
			clientY: number;
			force: number;
			identifier: number;
			pageX: number;
			pageY: number;
		}
	];
	currentTarget: {
		dataset: AnyObject;
		id: string;
		offsetLeft: number;
		offsetTop: number;
	};
	detail: {
		source: string;
		x: number;
		y: number;
		value?: string | number;
		data?: {
			type: string;
			data: {
				event_code: string;
				event_type: string;
				track_type: string;
				properties: AnyObject;
				event_time: number;
			};
		}[];
	};
	mark: AnyObject;
	mut: boolean;
	target: {
		dataset: AnyObject;
		id: string;
		offsetLeft: number;
		offsetTop: number;
	};
	timeStamp: number;
	touches: [
		{
			clientX: number;
			clientY: number;
			force: number;
			identifier: number;
			pageX: number;
			pageY: number;
		}
	];
	type: string;
	_userTap: boolean;
	_relatedInfo?: {
		anchorTargetText?: string;
	};
}
