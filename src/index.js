const ejs = require('ejs');
const jsdocRender = require('./utils/jsdocRender');
const getFilesPath = require('./utils/getFilesPath');
const defaultConfig = require('./utils/config');
const path = require('path');
const merge = require('lodash.merge');
const fs = require('fs-extra');
const { FastFs, FastPath } = require('@ads/node-utils');
/**
 * GenDoc 基于注释和可运行的示例代码自动生成文档的强大工具类
 *
 * ### 引入
 * ```js
 * const GenDoc = require('@ads/cli-plugin-doc');
 * ```
 *
 * @module  GenDoc
 */
module.exports = class GenDoc {
    /**
     * 基于ejs，用模板渲染文档
     *
     * @param {RenderObtions} options 获取用来渲染模板的数据
     * @returns {Promise<string>} 异步返回基于ejs模板渲染的文档文本
     */
    static async render(options) {
        const config = this._mergeToDefaultConfig(options);
        const renderData = await this.getRenderData(config);
        return ejs.renderFile(config.template, renderData);
    }

    /**
     * 将当前配置和默认配置合并
     *
     * @param {RenderObtions} options 获取用来渲染模板的数据
     * @returns {RenderObtions} 异步返回基于ejs模板渲染的文档文本
     * @ignore
     */
    static _mergeToDefaultConfig(options) {
        return merge({}, defaultConfig, options);
    }

    /**
     * 获取用来渲染模板的数据（jsdoc生成的文档和示例代码的内容）
     *
     * @param {RenderObtions} options 配置参数
     * @returns {Promise<GetRenderDataResult>}
     */
    static async getRenderData({ Jsdoc2mdOptions, codesOptions, helpers }) {
        const promises = [];
        let docs;
        if (Jsdoc2mdOptions) {
            promises.push(jsdocRender(Jsdoc2mdOptions).then(res => { docs = res; }));
        }
        let codes;
        if (codesOptions) {
            promises.push(this.getFilesCode(codesOptions).then(res => { codes = res; }));
        }
        let pkg;
        const pkgPath = FastPath.getCwdPath('package.json');
        if (FastFs.getPathStatSync(pkgPath)) {
            promises.push(fs.readJSON(pkgPath).then(res => { pkg = res; }));
        }
        await Promise.all(promises);
        return { docs, codes, helpers, pkg };
    }

    /**
     * 基于glob的文件遍历函数，返回文件对应内容的数组，
     * 以文件夹为单位返回文件内容对象，key是文件的extname
     *
     * @param {import('./utils/getFilesPath').GetFilesCodeOptions} options 获取源代码的文件路径配置参数
     * @returns {Promise<GetFilesCodeResult[]>}
     */
    static async getFilesCode(options) {
        const filesList = getFilesPath(options);
        return filesList.map(files => {
            const codes = {};
            files.forEach(file => {
                const ext = path.extname(file).replace(/^\./, '');
                const code = fs.readFileSync(file, { encoding: 'utf8' });
                codes[ext] = codes[ext] || [];
                codes[ext].push(code);
            });
            return codes;
        });
    }
};

/**
 * 函数[getRenderData]{@link getRenderData}的返回值
 *
 * @typedef {object} GetRenderDataResult
 * @property {string} docs 源码使用jsdoc渲染后的markdown文本
 * @property {Array<GetFilesCodeResult>} codes 获取到的代码内容
 */

/**
 * 渲染函数的配置参数
 *
 * @typedef {object} RenderObtions
 * @property {import('./utils/jsdocRender').Jsdoc2mdOptions} Jsdoc2mdOptions jsdocToMarkdown配置参数
 * @property {import('./utils/getFilesPath').GetFilesCodeOptions} codesOptions 获取源代码的文件路径配置参数
 */

/**
 * 获取文件的内容的返回值类型，key是文件的extname
 *
 * @typedef {Object.<string,string>} GetFilesCodeResult
 */

(async () => {
    module.exports.render({
        template: './template.ejs',
        Jsdoc2mdOptions: {
            files: ['./src/**/*.js'],
            configure: './jsdoc.conf.js',
        },
        helpers: {
            template: await module.exports.getFilesCode({ dir: './src/template', files: ['*'] }),
        },
        // codesOptions: { dir: './src/template', files: ['*'] },
    }).then(res => console.log(res));
})();
