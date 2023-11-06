<h1 align="center">@js-track/vite-plugin-auto-track</h1>

### 背景
因为Vue3组合式api的写法在uni-app编译之后的instance无法拿到的初始的事件名，如：getDetail 会被编译成
e0:()=>{}，这是通过aop的方式重写的话只是重写e0，实际触发事件的时候不会触发e0，只会触发getDetail

### 使用方法

```ts
// vite.config.j{t}s
import VitePluginAutoTrack from '@js-track/vite-plugin-auto-track';
...
{
  plugins: [ VitePluginAutoTrack() ]
}
...
```