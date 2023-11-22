/*
 * @Description: 导出原生微信小程序数据SDK /基础能力 /生命周期管理
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2022-09-30 14:18:15
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-20 18:49:34
 */
import pageCollect from '../collect/sort/page/mp-weixin';
import sdk from './sdk';

export { appCollect, collectService, errorCollect } from '../collect';
export * from '../message';
export { pageCollect };
export default sdk;
