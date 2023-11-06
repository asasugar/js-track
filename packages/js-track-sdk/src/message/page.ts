/*
 * @Description: 页面Properties
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-08-22 17:02:40
 */

export default class PageProperties {
	page_id = ''; // 页面编码
	page_title = ''; // 页面标题
	page_start_time = 0; // 页面进入时间
	page_end_time = 0; // 页面离开时间（仅leave使用）
	duration = 0; // 页面停留时间（仅leave使用）
	refer = ''; // 前一个页面链接
}
