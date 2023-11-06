/*
 * @Description: AOP工厂函数
 * before
 * after throw
 * after return
 * after
 * around
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-02-07 17:57:42
 */
// @ts-nocheck
export default {
  around(originFun, beforeFun, afterFun) {
    return function (...args) {
      beforeFun?.apply(this, args);
      originFun?.apply(this, args);
      afterFun?.apply(this, args);
    };
  },
  before(originFun, beforeFun) {
    return function (...args) {
      beforeFun?.apply(this, args);
      return originFun?.apply(this, args);
    };
  },
  after(originFun, afterFun) {
    return function (...args) {
      originFun?.apply(this, args);
      afterFun?.apply(this, args);
    };
  },
  afterReturn(originFun, afterFun) {
    return function (...args) {
      const res = originFun.apply(this, args);
      return afterFun.apply(this, [res]);
    };
  },
  afterThrow(originFun, afterThrowFun) {
    return function (...args) {
      const self = this;
      try {
        originFun.apply(self, args);
      } catch (e) {
        afterThrowFun.call(self, e);
      }
    };
  },
};
