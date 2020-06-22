module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },

  plugins: ['prettier'],

  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['error', { argsIgnorePatten: 'next' }],
  },
};
