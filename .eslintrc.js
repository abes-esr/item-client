module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    'guard-for-in' : 'off',
    // allow debugger during development
    'max-len': 'off',
    'import/no-unresolved': 'off',
    'prefer-destructuring': 'off',
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
