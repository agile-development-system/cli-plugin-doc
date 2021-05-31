/*
 * @Author: 锦阳
 * @Create: 2021年04月12日
 */
module.exports = function (api) {
    api.cache(true);
    const presets = [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: '12',
                },
            },
        ],
    ];

    const plugins = [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: false }],
        ['@babel/plugin-transform-modules-commonjs'],
        ['@babel/plugin-proposal-nullish-coalescing-operator'],
        ['@babel/plugin-proposal-optional-chaining'],
    ];

    return {
        presets,
        plugins,
    };
};
