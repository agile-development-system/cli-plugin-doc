const path = require('path');
const GenDoc = require('@ads/cli-plugin-doc');
/**
 * render配置生成
 *
 * @param {object} [options={}] 选项
 * @param {boolean} [options.needDirError] 是否需要触发文件路径错误
 * @param {boolean} [options.noFiles] 是否需要去除files选项
 * @param {boolean} [options.noDefault] 是否取消default配置
 * @param {boolean} [options.noCodes] 是否去除codes相关配置
 * @param options.output
 * @returns {import('../../src/index').RenderOptions}
 */
module.exports = async ({ needDirError, noFiles, noDefault, noCodes, output } = {}) => {
    return {
        files: noFiles ? null : ['./src/**/*.js'],
        ...(noCodes
            ? {}
            : {
                codesDir: needDirError ? './aaa' : './exa',
                codesFiles: ['*'],
            }
        ),
        output: output && path.resolve(__dirname, '../../.temp/test.md'),
        template: './template.ejs',
        config: './ads.doc.conf.js',
        noDefault,
        helpers: {
            template: await GenDoc.getFilesCode({ dir: './src/template', files: ['*'] }),
            defaultConfig: await GenDoc.getFilesCode({ dir: './src/utils', files: ['config.js'] }),
            dirname: path.join(__dirname, './utils'),
        },
    };
};
