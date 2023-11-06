/*
 * @Description: APP启动Properties
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-09-08 17:20:19
 */
export default class AppProperties {
	is_first_day: boolean = false; // 是否首次启动
	launch_source_from: string = ''; // 启动来源，包括启动系统的场景值
	query: AnyObject = {}; // 启动系统的 query 参数
}
