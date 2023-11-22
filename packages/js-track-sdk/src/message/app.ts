/*
 * @Description: APP启动Properties
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-11-20 18:54:28
 */
export default class AppProperties {
	launch_type = ''; // 启动类别 1第一次到前台  2不是第一次
	is_first_day = false; // 是否首次启动
	launch_source_from = ''; // 启动来源，包括启动系统的场景值
	query: AnyObject = {}; // 启动系统的 query 参数
}
