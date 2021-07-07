/*
 * @Author: 锦阳
 * @Create: 2021年05月13日
 */

const GenDoc = require('./lib/index');
const pkg = require('./package.json');
const preset = require('@agds/agds-doc-preset');
module.exports = (
    /**
     * 配置参数
     *
     * @returns {import('./lib/types/index').RenderOptions}
     */
    async () => {
        const [template, defaultConfig, cliUsages] = (await Promise.all([
            GenDoc.getFilesCode({ dir: './src/template', files: ['*'] }),
            GenDoc.getFilesCode({ dir: './src/utils', files: ['config.js'] }),
            GenDoc.getCliUsages(),
        ]));
        return {
            output: 'README.md',
            files: ['./src/**/*.js'],
            codesDir: './test/*',
            codesFiles: ['*.js'],
            presets: [preset],
            helpers: {
                devInstall: true,
                postfixes: [
                    {
                        id: 'defaultTemplate',
                        title: '默认文档渲染模板',
                        content: GenDoc.renderCode(template),
                    },
                    {
                        id: 'defaultConfig',
                        title: '默认文档渲染配置',
                        desc: '当前`__dirname`为`' + pkg.name + '/lib/utils`',
                        content: GenDoc.renderCode(defaultConfig),
                    },
                ],
                cliUsages,
                remark: GenDoc.getFileContent('./docs/remark.md'),
            },
        };
    })();
