module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        'standard',
        'plugin:jsdoc/recommended',
    ],
    plugins: [
        'jsdoc',
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 12,
        babelOptions: {
            configFile: './babel.config.js',
        },
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'space-before-function-paren': [
            'error',
            { anonymous: 'always', named: 'never', asyncArrow: 'always' },
        ],
        // jsdoc
        'valid-jsdoc': 'off',
        'jsdoc/require-property': 0,
        'jsdoc/require-returns-description': 0,
    },
    settings: {
        jsdoc: {
            mode: 'typescript',
        },
    },
};
