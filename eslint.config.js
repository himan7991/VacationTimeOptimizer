import js from '@eslint/js'
import { config as defineConfig, configs as tsConfigs } from 'typescript-eslint'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default defineConfig(
	{ ignores: ['node_modules/', 'dist/', 'graphify-out/'] },

	js.configs.recommended,
	...tsConfigs.recommended,
	react.configs.flat.recommended,
	react.configs.flat['jsx-runtime'],
	jsxA11y.flatConfigs.recommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,

	// Applies to every linted file
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		settings: {
			react: { version: 'detect' },
			'import/resolver': {
				typescript: true,
				node: { paths: ['src'], extensions: ['.js', '.jsx', '.ts', '.tsx'] }
			}
		},
		rules: {
			'no-console': ['error', { allow: ['error'] }]
		}
	},

	// Tailwind and PostCSS configs are CommonJS
	{
		files: ['**/*.cjs'],
		languageOptions: { sourceType: 'commonjs' }
	},

	// Must be last: turns off formatting rules that would fight Prettier
	prettier
)
