const ejs = require('ejs');
const jsdocRender = require('./utils/jsdocRender');
const getFilesPath = require('./utils/getFilesPath');
const defaultConfig = require('./utils/config');
const path = require('path');
const fs = require('fs-extra');
const { FastFs, FastPath, PresetUtils } = require('@ads/node-utils');
/**
 * GenDoc 基于注释和可运行的示例代码自动生成文档的强大工具类
 *
 * #### 引入
 * ```js
 * const GenDoc = require('@ads/cli-plugin-doc');
 * ```
 *
 * @module GenDoc
 */
class GenDoc {
    /**
     * 基于ejs，用模板渲染文档
     *
     * @param {RenderOptions} options 获取用来渲染模板的数据
     * @returns {Promise<string>} 异步返回基于ejs模板渲染的文档文本
     */
    static async render(options) {
        const config = await _mergeToDefaultConfig(options);
        const renderData = await this.getRenderData(config, false);
        const res = await ejs.renderFile(config.template, renderData);
        if (config.output) {
            await FastFs.writeFile(FastPath.getCwdPath(config.output), res);
        } else {
            return res;
        }
    }

    /**
     * 获取用来渲染模板的数据（jsdoc生成的文档和示例代码的内容）
     *
     * @param {RenderOptions} options 配置参数
     * @param {boolean} [needMergeConfig=true] 是否需要调用`_mergeToDefaultConfig`，
     * options已经是merge处理过的就不需要调用,否则不推荐传入`false`
     * 会导致别名不支持
     * @returns {Promise<GetRenderDataResult>}
     */
    static async getRenderData(options, needMergeConfig = true) {
        // node API调用时需要merge以附上默认配置
        if (needMergeConfig) {
            options = await _mergeToDefaultConfig(options);
        }
        const { jsdoc2mdOptions, codesOptions, helpers } = options;
        const promises = [];
        let docs;
        if (jsdoc2mdOptions && jsdoc2mdOptions.files && jsdoc2mdOptions.files.length) {
            promises.push(jsdocRender(jsdoc2mdOptions).then(res => { docs = res; }));
        }
        let codes;
        if (codesOptions && JSON.stringify(codesOptions) !== '{}') {
            promises.push(this.getFilesCode(codesOptions).then(res => { codes = res; }));
        }
        let pkg;
        const pkgPath = FastPath.getCwdPath('package.json');
        /* istanbul ignore next */
        if (FastFs.getPathStatSync(pkgPath)) {
            promises.push(FastFs.readJson(pkgPath).then(res => { pkg = res; }));
        }
        await Promise.all(promises);
        return { docs, codes, helpers, pkg };
    }

    /**
     * 基于glob的文件遍历函数，返回文件对应内容的数组，
     * 以文件夹为单位返回文件内容对象，key是文件的extname
     *
     * @param {import('./utils/getFilesPath').GetFilesCodeOptions} options 获取源代码的文件路径配置参数
     * @returns {Promise<Array<GetFilesCodeResult>>}
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

module.exports = GenDoc;

/* istanbul ignore next */
/**
 * 将当前配置和默认配置合并
 *
 * @param {RenderOptions} options 获取用来渲染模板的数据
 * @returns {RenderOptions} 异步返回基于ejs模板渲染的文档文本
 * @ignore
 */
async function _mergeToDefaultConfig(options = {}) {
    // 获取用户本地配置文件
    const cwdConfPath = FastPath.getCwdPath(options.config || 'ads.doc.config.js');
    options.presets = options.presets || [];
    if (FastFs.getPathStatSync(cwdConfPath)) {
        const userConfig = require(cwdConfPath);
        options.presets.unshift(userConfig);
    }
    !options.noDefault && options.presets.push(defaultConfig);
    options.presets.push({ jsdoc2mdOptions: {}, codesOptions: {}, jsdocEngineOptions: {} });
    const config = await PresetUtils.getDeepPresetMerge(options);
    // files别名支持
    if (config.files) {
        config.jsdoc2mdOptions.files = config.files;
    }
    // codesDir&codesFiles别名支持
    if (config.codesDir && config.codesFiles) {
        config.codesOptions.dir = config.codesDir;
        config.codesOptions.files = config.codesFiles;
    }
    // jsdocEngineOptions配置支持
    if (config.jsdocEngineOptions && JSON.stringify(config.jsdocEngineOptions) !== '{}') {
        const jsdocEngineConfigPath = path.join(__dirname, '../.temp/jsdoc.conf.json');
        await FastFs.writeJsonFormat(jsdocEngineConfigPath, config.jsdocEngineOptions);
        config.jsdoc2mdOptions.configure = jsdocEngineConfigPath;
    }
    return config;
}

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
 * @typedef {object} RenderOptions
 * @property {string[]} files `jsdoc2mdOptions.files`的别名
 * @property {fs.PathLike} output doc文档渲染导出的文件名称路径，相对于cwd目录
 * @property {string} template ejs渲染的模板相对于cwd的路径或者绝对路径
 * @property {string} [codesDir] `codesOptions.dir`的别名
 * @property {string[]} [codesFiles] `codesOptions.codesFiles`的别名
 * @property {fs.PathLike} [conifg=ads.doc.config.js] 配置文件路径，默认为运行目录下的`ads.doc.config.js`,仅支持`js`文件类型
 * @property {import('./utils/jsdocRender').Jsdoc2mdOptions} [jsdoc2mdOptions] jsdocToMarkdown配置参数
 * @property {import('./utils/getFilesPath').GetFilesCodeOptions} [codesOptions] 获取源代码的文件路径配置参数
 * @property {object} [jsdocEngineOptions] jsdoc解析引擎的配置，实际上是`jsdoc.conf.js`的整合，
 * 也可以使用  `RenderOptions.jsdoc2mdOptions.configure`字段来指定本地的jsdoc配置
 * 配置选项[👉参考文档](https://jsdoc.app/about-configuring-jsdoc.html)
 * @property {object} [helpers] 注入ejs模板的`helpers`对象，提供模板使用的帮助函数和变量
 * @property {RenderOptions[]} [presets] 基于preset机制实现配置支持预设的功能，
 * 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config)`PresetUtils.getDeepPresetMerge`
 * @property {boolean} [noDefault] 取消合并默认配置
 * @property {import('@ads/node-utils').ConfigModify} [modify] 将默认配置和preset合并后生成的config再次处理的钩子
 * 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config)
 */

/**
 * 获取文件的内容的返回值类型，key是文件的extname
 *
 * @typedef {Object.<string,string>} GetFilesCodeResult
 */
