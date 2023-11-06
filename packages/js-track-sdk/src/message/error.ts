/*
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-02-08 10:32:20
 * @Description: 错误Properties
 */
export default class ErrorProperties {
	type = ''; // 错误类型
	name = ''; // 错误名称
	stack = ''; // 错误堆栈
	page = ''; // 崩溃页面
	duration = ''; // 使用时长
	foreground_status = ''; // 前后台状态
	remark?: string = ''; // 错误备注
}
