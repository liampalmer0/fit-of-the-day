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
    camelcase: ['error']
  }
};
