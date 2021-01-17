module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    camelcase: ['error'],
    eqeqeq: ['error', 'always'],
    'dot-location': ['error', 'property'],
    curly: ['error'],
    'comma-style': ['error', 'last'],
    'no-loop-func': 'error',
    'comma-dangle': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    'key-spacing': ['error', { mode: 'strict' }],
    'arrow-body-style': ['error', 'as-needed'],
    'no-multi-assign': 'error',
    allowIndentationTabs: 0,
    'no-unneeded-ternary': 'error'
  }
};
