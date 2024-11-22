import globals  from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    ignores: [
      'dist/',
      'eslint.config.js'
    ],
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {

      'camelcase': 'warn',
      'no-unused-vars': 'warn',
      'eol-last': 'error',
      'prefer-const': ['error', { 'ignoreReadBeforeAssign': true }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'indent': ['error', 2],

      'max-len': [
        'error', 120, 100,
        { 'ignoreComments': true },
      ],
      'max-lines-per-function': [
        'error',
        {
          'max': 30,
          'skipBlankLines': true,
          'skipComments': true,
        },
      ],
      'complexity': [
        'error',
        12,
      ],
      'arrow-parens': ['error', 'always'],
      'object-curly-newline': ['error', { 'multiline': true, 'minProperties': 3 }],
      'array-bracket-newline': ['error', { 'multiline': true, 'minItems': 3 }],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },


];