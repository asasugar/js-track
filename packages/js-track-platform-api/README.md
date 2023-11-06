<h1 align="center">@js-track/platform-api</h1>

小程序平台API兼容库


## 依赖安装


```bish
pnpm add @js-track/platform-api
```

## 使用

### utils

```ts
import uiClient from '@js-track/platform-api';

uiClient.onAppShow(() => {
  this.appOnShow();
});
uiClient.onAppHide(() => {
  this.appOnHide();
});
```