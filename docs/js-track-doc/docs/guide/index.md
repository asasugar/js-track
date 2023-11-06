# 开始

## 引入 js-track 埋点SDK

::: tip 兼容性注意
js-track 需要 [Node.js](https://nodejs.org/en/) 版本 16+。然而，开发 js-track 项目需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。
:::

使用 NPM:

```bash
$ npm i @js-track/sdk
```

使用 Yarn:

```bash
$ yarn add @js-track/sdk
```

使用 PNPM:

```bash
$ pnpm add @js-track/sdk
```

然后按照提示操作即可！

**TypeScript 支持**:

类型定义文件由 @js-track/types 模块提供，安装后请注意配置 tsconfig.json 文件中的 compilerOptions > types 部分，默认支持了 @dcloudio/types、miniprogram-api-typings、mini-types，且对外暴露LTBusiness 命名空间。对于缺少或者错误的类型定义，可以自行在本地新增或修改并同时报告给 [xxj95719@gmail.com](https://github.com/asasugar/js-track/issues) 请求更新。


## 使用未发布的功能

如果你迫不及待想要体验最新的功能，可以自行克隆 [js-track 仓库](https://github.com/asasugar/js-track.git) 到本地机器上然后切换至master分支自行将其链接（将需要 [pnpm](https://pnpm.io/)）：

```bash
git clone https://github.com/asasugar/js-track.git
cd js-track
pnpm install
cd packages/js-track-sdk
pnpm run build
pnpm link --global # 在这一步中可使用你喜欢的包管理器
```

然后，回到你的 小程序 项目并运行 `pnpm link --global @js-track/sdk`（或者使用你的其他包管理工具来全局链接 `@js-track/sdk`）。重新启动小程序项目来体验新功能吧！

## Issue

如果你有疑问或者需要帮助，可以到 [Issues](https://github.com/asasugar/js-track/issues) 来新建 Issue。