module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'standard-with-typescript',
		'prettier',
		'eslint-config-prettier',
		'eslint:recommended', // 使用推荐的eslint
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended'
	],
	overrides: [
		{
			env: {
				node: true
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		parser: '@typescript-eslint/parser'
	},
	globals: {
		defineProps: 'readonly',
		defineEmits: 'readonly',
		defineExpose: 'readonly',
		withDefaults: 'readonly'
	},
	rules: {
		'prettier/prettier': 'error',
	}
};
