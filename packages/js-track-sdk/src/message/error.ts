/*
 * @Author: Xiongjie.Xue(xxj95719@gmail.com)
 * @Date: 2023-08-22 16:48:50
 * @LastEditors: Xiongjie.Xue(xxj95719@gmail.com)
 * @LastEditTime: 2023-02-08 10:32:20
 * @Description: 错误Properties
 */
export default class ErrorProperties {
  type: string = ''; // 错误类型
  name: string = ''; // 错误名称
  stack: string = ''; // 错误堆栈
  page: string = ''; // 崩溃页面
  duration: string = ''; // 使用时长
  foreground_status: string = ''; // 前后台状态
  remark?: string = ''; // 错误备注
}
