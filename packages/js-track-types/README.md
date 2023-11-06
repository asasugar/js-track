<h1 align="center">@js-track/types</h1>

lunik-track埋点库ts声明

## Contents

- business.d.ts 业务声明LTBusiness
- dcloudio-extends.d.ts 扩展uni-app声明
- wechat-extends.d.ts 扩展微信原生声明
- global.d.ts 全局声明扩展


## 依赖安装


```bish
pnpm add @js-track/types -D
```

## 使用

### tsconfig.json

```json
{
  "extends": "@js-track/shared/configs/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "types": [
      "@js-track/types",
    ],
    "paths": {
      "@/*": [
        "src/*"
      ],
    }
  },
  "include": [
    "src/**/*",
  ],
  "exclude": ["**/node_modules/**"]
}
```

### utils

```ts
import { aop, Logger, isFunction } from '@js-track/types/utils'
```