/*
 * @Author: 锦阳
 * @Create: 2021年05月13日
 */
const path = require('path');
const GenDoc = require('./src/index');

module.exports = (
    /**
     * 配置参数
     *
     * @returns {import('./src/index').RenderOptions}
     */
    async () => ({
        output: 'README.md',
        files: ['./src/**/*.js'],
        template: './template.ejs',
        codesDir: './test/*',
        codesFiles: ['*.js'],
        jsdocEngineOptions: {
            plugins: [
                require.resolve('jsdoc-tsimport-plugin'),
            ],
        },
        helpers: {
            template: await GenDoc.getFilesCode({ dir: './src/template', files: ['*'] }),
            defaultConfig: await GenDoc.getFilesCode({ dir: './src/utils', files: ['config.js'] }),
            dirname: path.join(__dirname, './utils'),
        },
    }))();
