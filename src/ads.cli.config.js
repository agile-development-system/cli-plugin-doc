/*
 * @Author: 锦阳
 * @Create: 2021年05月16日
 */

const { Notice } = require('@ads/node-utils');
const { doc } = require('./plugin');
module.exports = [
    {
        cmd: 'doc',
        desc: 'ads敏捷开发系统doc文档生成器',
        action: doc,
        help: {
            after: [
                Notice.getStr('warn', '注意：') + '每个包含通配符的路径都需要用引号包裹，否则会被系统提前解析导致意料之外的错误',
            ],
        },
        opts: [
            {
                opt: '<files...>',
                desc: 'jsdoc入口文件glob格式路径描述(需要用引号包裹避免解析失败)，相对于cwd目录',
            },
            {
                opt: '-o,--output <output>',
                desc: 'doc文档渲染导出的文件名称路径，相对于cwd目录',
            },
            {
                opt: '-c,--config <config>',
                desc: '配置文件路径，相对于cwd目录，仅支持js文件类型',
                default: 'ads.doc.config.js',
            },
            {
                opt: '-t,--template <template>',
                desc: 'ejs渲染的模板相对于cwd的路径或者绝对路径',
            },
            {
                opt: '--cd,--codes-dir <codesDir>',
                desc: 'glob格式路径，代码演示示例的对应文件夹路径，路径需要到某个具体示例的对应文件夹',
            },
            {
                opt: '--cf,--codes-files <codesFiles...>',
                desc: 'glob格式路径，相对于codesDir的代码演示文件夹的文件路径描述',
            },
            {
                opt: '--no-default',
                desc: '禁止使用默认配置，默认配置相对比较通用，大部分情况不需要禁止，当默认配置和你的配置冲突时可以使用此选项',
            },
        ],
    },
];
