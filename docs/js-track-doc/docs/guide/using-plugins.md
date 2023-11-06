# 使用插件

js-track 可以使用编写插件对打包工具进行扩展，这得益于 打包工具（如：Vite、Webpack、Rollup） 的插件接口设计。这意味着 可以利用 打包工具 插件的强大生态系统，同时根据需要也能够扩展功能。

## 添加一个 Vite 插件

若要使用一个插件，需要将它添加到项目的 `devDependencies` 并在 `vite.config.js` 配置文件中的 `plugins` 数组中引入它。例如，要想为UniApp Vue3插入自动埋点，可以按下面这样使用插件 [@js-track/vite-plugin-auto-track](https://github.com/asasugar/js-track/tree/master/plugins/vite-plugin-auto-track)：

```
$ pnpm add -D @js-track/vite-plugin-auto-track
```

```js{1,6}
// vite.config.js
import ViteAutoTrack from '@js-track/vite-plugin-auto-track'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    ViteAutoTrack(),
  ],
})
```

## 创建插件

**在 js-track 项目 `plugins` 目录下新建 {打包工具}-plugin-{功能} 文件夹**



**新建 package.json**

```json
{
  "name": "@js-track/{打包工具}-plugin-{功能}", // 根据具体情况调整替换
  "version": "1.0.0",
  "description": "", // 补充插件描述
  "keywords": [
    ... // 补充插件关键词
  ],
  "license": "MIT",
  "main": "./dist/index.js",
  "type": "module",
  "types": "./dist/index.d.ts",
  "scripts": {
    "clean": "rimraf ./dist",
    "build": "pnpm clean && tsup"
  },
  "devDependencies": {
    "rimraf": "^5.0.5",
    "tsup": "^7.2.0"
  }
}
```

**新建插件功能**

```ts
// src/index.ts
export default function VitePluginAutoTrack() {}
```

**新建tsup.config.ts 打包TypeScipt文件**

```ts
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['./src/index.ts'],
	clean: true,
	dts: true,
	outDir: 'dist',
	format: ['esm']
});
```

**发布插件**

阅读 [changeset 项目管理](./changeset) 文档了解如何发布。
