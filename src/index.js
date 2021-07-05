const ejs = require('ejs');
const jsdocRender = require('./utils/jsdocRender');
const getFilesPath = require('./utils/getFilesPath');
const defaultConfig = require('./utils/config');
const path = require('path');
const fs = require('fs-extra');
const { FastFs, FastPath, PresetUtils } = require('@agds/node-utils');
const { exec } = require('child_process');
const renderCode = require('./utils/renderCode');
/**
 * GenDoc 基于注释和可运行的示例代码自动生成文档的强大工具类
 *
 * #### 引入
 * ```js
 * const GenDoc = require('@agds/cli-plugin-doc');
 * ```
 *
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

    static renderCode = renderCode;
    /**
     * 获取命令行使用帮助文档
     * 建议提前确保全局使用了最新的脚本
     * 函数为异步函数，注意不能作为ejs帮助函数传入，可以获取返回值后，将返回值作为helpers的变量传入
     *
     * @returns {Promise<string[]>}
     */
    static async getCliUsages() {
        const pkgPath = FastPath.getCwdPath('package.json');
        /* istanbul ignore next */
        if (FastFs.getPathStatSync(pkgPath)) {
            const pkg = require(pkgPath);
            const bin = pkg.bin;
            try {
                return await Promise.all(
                    Object.keys(bin)
                        .map(key => execPromise(`${key} -h`)),
                ).then(res => res.filter(Boolean));
            } catch (error) {
                /* istanbul ignore next */
                await Promise.all([
                    execPromise('chmod -R 750 lib'),
                    execPromise('npm link'),
                ]);
                /* istanbul ignore next */
                return this.getCliUsages();
            }
        } else {
            /* istanbul ignore next */
            throw new Error('未检测到根目录下存在【package.json】文件');
        }
    }

    /**
     * 读取文件内容
     *
     * @param {string} filename 相对于运行目录的文件路径
     * @returns {string}
     */
    static getFileContent(filename) {
        return fs.readFileSync(FastPath.getCwdPath(filename), { encoding: 'utf-8' });
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
    const cwdConfPath = FastPath.getCwdPath(options.config || 'agds.doc.config.js');
    options.presets = options.presets || [];
    if (FastFs.getPathStatSync(cwdConfPath)) {
        const userConfig = require(cwdConfPath);
        options.presets.unshift(userConfig);
    }
    options.presets.push({ jsdoc2mdOptions: {}, codesOptions: {}, jsdocEngineOptions: {} });
    let config = await PresetUtils.getDeepPresetMerge(options);
    // 支持配置是否使用默认配置
    if (config.default !== false) {
        config.presets = config.presets || [];
        config.presets.push(defaultConfig);
    }
    config = await PresetUtils.getDeepPresetMergeAndModify(config);
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
/* istanbul ignore next */
/**
 * execPromise
 *
 * @param {string} command shell命令
 * @returns {Promise<string>}
 * @ignore
 */
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            return resolve(stdout);
        });
    });
}

/**
 * 函数[GenDoc.getRenderData](#GenDoc.getRenderData)的返回值
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
 * @property {fs.PathLike} [conifg=agds.doc.config.js] 配置文件路径，默认为运行目录下的`agds.doc.config.js`,仅支持`js`文件类型
 * @property {boolean} [default] 是否合并默认配置，一般我们认为您是需要默认配置的，当默认配置和你的需求冲突时可以设置为`false`
 * @property {import('./utils/jsdocRender').Jsdoc2mdOptions} [jsdoc2mdOptions] jsdocToMarkdown配置参数
 * @property {import('./utils/getFilesPath').GetFilesCodeOptions} [codesOptions] 获取源代码的文件路径配置参数
 * @property {object} [jsdocEngineOptions] jsdoc解析引擎的配置，实际上是`jsdoc.conf.js`的整合，
 * 也可以使用  `RenderOptions.jsdoc2mdOptions.configure`字段来指定本地的jsdoc配置
 * 配置选项[👉参考文档](https://jsdoc.app/about-configuring-jsdoc.html)
 * @property {DefaultHelpers} [helpers] 注入ejs模板的`helpers`对象，提供模板使用的帮助函数和变量，配合模板使用
 * @property {RenderOptions[]} [presets] 基于preset机制实现配置支持预设的功能，
 * 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config)`PresetUtils.getDeepPresetMerge`
 * @property {boolean} [noDefault] 取消合并默认配置
 * @property {import('@agds/node-utils').ConfigModify} [modify] 将默认配置和preset合并后生成的config再次处理的钩子
 * 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config)
 */

/**
 * 获取文件的内容的返回值类型，key是文件的extname
 *
 * @typedef {Object.<string,string>} GetFilesCodeResult
 */

/**
 * 默认模板所支持的`helpers`属性
 *
 * @typedef {Object} DefaultHelpers
 * @property {string} [installCode] 安装脚本，bash脚本，默认为`npm i ${pkg.name}`，如不符合要求，可以通过此字段自行修改
 * @property {boolean} [devInstall] 是否是作为开发依赖下载，`true`时，默认下载代码自动拼接npm `-D` 参数
 * @property {string} [importCode] 引入代码示例，js字符串
 * @property {string} [exportCode] 导出代码，js字符串
 * @property {string[]} [cliUsages] cli命令行使用帮助文档，格式类似`agds-doc -h`的输出内容
 * @property {string} [remark] 文档备注信息，md字符串
 * @property {GenDoc.renderCode} [renderCode] 将`GenDoc.getFileCodes`的返回值渲染成对应的代码段
 * @property {Postfix[]} [postfixes] 后缀内容数组
 * @property {string} [logo] logo
 */

/**
 * 后缀内容类型
 *
 * @typedef {Object} Postfix
 * @property {string} [id] 锚点的名称，填写之后可以支持 `href="#${id}"`锚点定位
 * @property {string} [title] 内容的标题
 * @property {string} [desc] 内容的描述
 * @property {string} [content] 内容的正文
 */
