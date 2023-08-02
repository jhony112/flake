module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb-base', 'prettier'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        camelcase: 'off',
        'no-underscore-dangle': 'off',
        'no-console': 'off',
    },
}
