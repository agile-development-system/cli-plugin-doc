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
                    node: 'current',
                },
            },
        ],
    ];

    const plugins = [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-transform-modules-commonjs'],
    ];

    return {
        presets,
        plugins,
    };
};
