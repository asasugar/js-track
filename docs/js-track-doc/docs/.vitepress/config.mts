import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'js-track',
	description: '小程序埋点工具链',
	lang: 'zh-CN',
	base: '/js-track/',
	outDir: '../public',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: '指引', link: '/guide/why' },
			{ text: 'Examples', link: '/markdown-examples' }
		],

		sidebar: [
			{
				text: '指引',
				items: [
					{ text: '为什么选js-track', link: '/guide/why' },
					{ text: '开始', link: '/guide/index' },
					{ text: '功能', link: '/guide/features' },
					{ text: '使用插件', link: '/guide/using-plugins' },
					{ text: '构建生成版本', link: '/guide/build' },
					{ text: 'changeset 项目管理', link: '/guide/changeset' }
				]
			},
			{
				text: 'API',
				items: [
					{ text: 'Markdown Examples', link: '/markdown-examples' },
					{ text: 'Runtime API Examples', link: '/api-examples' }
				]
			}
		],
		socialLinks: [{ icon: 'github', link: 'https://github.com/asasugar/js-track' }]
	}
});
