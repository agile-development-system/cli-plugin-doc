/*
 * @Author: 锦阳
 * @Create: 2021年05月13日
 */

const GenDoc = require('./src/index');
const { exec, execSync } = require('child_process');
module.exports = (
    /**
     * 配置参数
     *
     * @returns {import('./src/index').RenderOptions}
     */
    async () => {
        const [template, defaultConfig, cliUsages] = (await Promise.all([
            GenDoc.getFilesCode({ dir: './src/template', files: ['*'] }),
            GenDoc.getFilesCode({ dir: './src/utils', files: ['config.js'] }),
            getCliUsages(),
        ]));
        return {
            output: 'README.md',
            files: ['./src/**/*.js'],
            template: './template.ejs',
            codesDir: './test/*',
            codesFiles: ['*.js'],
            // jsdocEngineOptions: {
            //     plugins: [
            //         require.resolve('jsdoc-tsimport-plugin'),
            //     ],
            // },
            helpers: {
                template,
                defaultConfig,
                cliUsages,
            },
        };
    })();

/**
 * 获取命令行使用帮助文档
 *
 * @returns {Promise<string[]>}
 */
function getCliUsages() {
    const pkg = require('./package.json');
    const bin = pkg.bin;
    execSync('npm link');
    return Promise.all(
        Object.keys(bin)
            .map(key => new Promise((resolve) => {
                exec(`${key} -h`, (error, stdout) => {
                    if (error) {
                        return;
                    }
                    resolve(stdout);
                });
            })),
    ).then(res => res.filter(Boolean));
}
