<h1 align="center">@js-track/shared</h1>

埋点公共库

## Contents

- configs
  - tsconfig.json配置

- utils
  - aop.ts aop函数
  - event.ts EventBus函数
  - is.ts 类型判断辅助函数
  - logger.ts 日志
  - local.ts 持久化缓存


## 依赖安装


```bish
pnpm add @js-track/shared
```

## 使用

### configs

```json
{
  "extends": "@js-track/shared/configs/tsconfig.base.json",
  ...
}
```

### utils

```ts
import { aop, Logger, isFunction } from '@js-track/shared/utils'
```