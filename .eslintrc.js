module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier/react'],
  plugins: ['prettier', 'json', '@typescript-eslint'],
  parser: 'babel-eslint',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'no-continue': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'prefer-destructuring': 'off',
    'class-methods-use-this': 'off',
    'max-len': [
      'warn',
      80,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: false,
      },
    ],
    'no-unused-vars': 'off',
    'no-prototype-builtins': 'off',
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
    'no-multi-assign': 'off',
    'lines-around-comment': 'off',
    'no-param-reassign': 'off',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    eqeqeq: 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
    'guard-for-in': 'off',
  },
  overrides: [
    {
      files: ['*.spec.js', '**/mocks/**/*.js'],
      rules: {
        'global-require': 'off',
      },
    },
    {
      files: ['*.ts', '*.d.ts'],
      plugins: ['@typescript-eslint'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false,
          },
        ],
      },
    },
  ],
};
