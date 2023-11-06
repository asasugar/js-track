/*
 * @Description: AOP工厂函数
 * before
 * after throw
 * after return
 * after
 * around
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-11-15 16:26:36
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-10-31 15:42:34
 */
export default {
	around(
		originFun: { apply: (arg0: any, arg1: any[]) => void },
		beforeFun: { apply: (arg0: any, arg1: any[]) => void },
		afterFun: { apply: (arg0: any, arg1: any[]) => void }
	) {
		return (...args: any) => {
			beforeFun?.apply(this, args);
			originFun?.apply(this, args);
			afterFun?.apply(this, args);
		};
	},
	before(
		originFun: { apply: (arg0: any, arg1: any[]) => any },
		beforeFun: { apply: (arg0: any, arg1: any[]) => void }
	) {
		return (...args: any) => {
			beforeFun?.apply(this, args);
			return originFun?.apply(this, args);
		};
	},
	after(
		originFun: { apply: (arg0: any, arg1: any[]) => void },
		afterFun: { apply: (arg0: any, arg1: any[]) => void }
	) {
		return (...args: any) => {
			originFun?.apply(this, args);
			afterFun?.apply(this, args);
		};
	},
	afterReturn(
		originFun: { apply: (arg0: any, arg1: any[]) => any },
		afterFun: { apply: (arg0: any, arg1: any[]) => any }
	) {
		return (...args: any) => {
			const res = originFun.apply(this, args);
			return afterFun.apply(this, [res]);
		};
	},
	afterThrow(
		originFun: { apply: (arg0: any, arg1: any[]) => void },
		afterThrowFun: { call: (arg0: any, arg1: unknown) => void }
	) {
		return (...args: any) => {
			try {
				originFun.apply(this, args);
			} catch (e) {
				afterThrowFun.call(this, e);
			}
		};
	}
};
