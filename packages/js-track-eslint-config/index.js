module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		parser: {
			ts: '@typescript-eslint/parser', // eslint解析器，用于解析ts
			js: 'espree'
		},
		ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
		sourceType: 'module' // Allows for the use of imports
	},
	extends: [
		'plugin:@typescript-eslint/recommended', // //定义文件继承的子规范 from the @typescript-eslint/eslint-plugin
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
		'prettier'
	],
	plugins: ['@typescript-eslint', 'prettier'], // 定义了该eslint文件所依赖的插件
	env: {
		browser: true,
		node: true
	},
	globals: {
		uni: true,
		getApp: true,
		getCurrentPages: true,
		wx: true,
		my: true,
		tt: true
	},
	ignorePatterns: ['dist', 'node_modules'],
	rules: {
		'prettier/prettier': [
			'error',
			{
				printWidth: 100,
				semi: true,
				singleQuote: true,
				trailingComma: 'none',
				bracketSpacing: true,
				jsxBracketSameLine: true,
				arrowParens: 'avoid',
				useTabs: true,
				endOfLine: 'auto',
				parser: 'typescript'
			}
		],
		'arrow-body-style': 'off',
		'prefer-arrow-callback': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-object-literal-type-assertion': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/triple-slash-reference': 'off'
	}
};
