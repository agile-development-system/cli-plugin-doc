
# @ads/cli-plugin-doc
**版本** ：1.0.0
通用注释转markdown文档生成器,目标是支持所有类型的文件

## 快速开始

### 安装
```bash
npm i @ads/cli-plugin-doc
```

## 代码演示
```js
// ads.doc.config.js

const path = require('path');
const GenDoc = require('@ads/cli-plugin-doc');
/**
 * render配置生成
 *
 * @param {object} [options] 选项
 * @param {boolean} [options.needDirError] 是否需要触发文件路径错误
 * @param {boolean} [options.noFiles] 是否需要去除files选项
 * @param {boolean} [options.noDefault] 是否取消default配置
 * @param {boolean} [options.noCodes] 是否去除codes相关配置
 * @returns {import('../../src/index').RenderOptions}
 */
module.exports = async ({ needDirError, noFiles, noDefault, noCodes } = {}) => {
    return {
        files: noFiles ? null : ['./src/**/*.js'],
        ...(noCodes
            ? {}
            : {
                codesDir: needDirError ? './aaa' : './exa',
                codesFiles: ['*'],
            }
        ),
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

```
```js
const { expect, test } = require('@jest/globals');
const GenDoc = require('@ads/cli-plugin-doc');
const config = require('../__mock__/index'); ;

test('GenDoc render', async () => {
    const res = await GenDoc.render(await config());
    expect(typeof res === 'string').toBe(true);
});

// 同时也会输出reademe
test('GenDoc render output & use ads.doc.config.js', async () => {
    const res = await GenDoc.render();
    expect(typeof res === 'undefined').toBe(true);
});

test('GenDoc render no files', async () => {
    const res = await GenDoc.render(await config({ noFiles: true }));
    expect(typeof res === 'string').toBe(true);
});

test('GenDoc render no codes', async () => {
    const res = await GenDoc.render(await config({ noCodes: true }));
    expect(typeof res === 'string').toBe(true);
});

test('GenDoc render error', async () => {
    try {
        await GenDoc.render(await config({ needDirError: true }));
    } catch (error) {
        expect(error.message).toMatch('未匹配到任何目录，请确认输入路径');
    }
});

test('GenDoc getRenderData', async () => {
    const res = await GenDoc.getRenderData(await config({ noDefault: true }));
    expect(typeof res === 'object').toBe(true);
});

test('GenDoc getRenderData nodefault', async () => {
    const res = await GenDoc.getRenderData(await config(), false);
    expect(typeof res === 'object').toBe(true);
});

```



## API文档
<a name="module_GenDoc"></a>

### GenDoc
GenDoc 基于注释和可运行的示例代码自动生成文档的强大工具类

#### 引入
```js
const GenDoc = require('@ads/cli-plugin-doc');
```

<a name="module_GenDoc.render"></a>

#### GenDoc.render(options) ⇒ <code>Promise.&lt;string&gt;</code>
基于ejs，用模板渲染文档

**性质**: [<code>GenDoc</code>](#module_GenDoc)的静态方法
**返回值**: <code>Promise.&lt;string&gt;</code> - 异步返回基于ejs模板渲染的文档文本

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | <code>module:GenDoc~RenderOptions</code> | 获取用来渲染模板的数据 |

<a name="module_GenDoc.getRenderData"></a>

#### GenDoc.getRenderData(options, [needMergeConfig]) ⇒ <code>Promise.&lt;module:GenDoc~GetRenderDataResult&gt;</code>
获取用来渲染模板的数据（jsdoc生成的文档和示例代码的内容）

**性质**: [<code>GenDoc</code>](#module_GenDoc)的静态方法

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| options | <code>module:GenDoc~RenderOptions</code> |  | 配置参数 |
| [needMergeConfig] | <code>boolean</code> | <code>true</code> | 是否需要调用`_mergeToDefaultConfig`， options已经是merge处理过的就不需要调用,否则不推荐传入`false` 会导致别名不支持 |

<a name="module_GenDoc.getFilesCode"></a>

#### GenDoc.getFilesCode(options) ⇒ <code>Promise.&lt;Array.&lt;module:GenDoc~GetFilesCodeResult&gt;&gt;</code>
基于glob的文件遍历函数，返回文件对应内容的数组，
以文件夹为单位返回文件内容对象，key是文件的extname

**性质**: [<code>GenDoc</code>](#module_GenDoc)的静态方法

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | [<code>GetFilesCodeOptions</code>](#GetFilesCodeOptions) | 获取源代码的文件路径配置参数 |

<a name="GetRenderDataResult"></a>

### GetRenderDataResult : <code>object</code>
函数[getRenderData](getRenderData)的返回值

**性质**: 类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| docs | <code>string</code> | 源码使用jsdoc渲染后的markdown文本 |
| codes | <code>Array.&lt;module:GenDoc~GetFilesCodeResult&gt;</code> | 获取到的代码内容 |

<a name="RenderOptions"></a>

### RenderOptions : <code>object</code>
渲染函数的配置参数

**性质**: 类型声明
**属性**

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| files | <code>Array.&lt;string&gt;</code> |  | `jsdoc2mdOptions.files`的别名 |
| template | <code>string</code> |  | ejs渲染的模板相对于cwd的路径或者绝对路径 |
| [codesDir] | <code>string</code> |  | `codesOptions.dir`的别名 |
| [codesFiles] | <code>Array.&lt;string&gt;</code> |  | `codesOptions.codesFiles`的别名 |
| [conifg] | <code>fs.PathLike</code> | <code>ads.doc.config.js</code> | 配置文件路径，默认为运行目录下的`ads.doc.config.js`,仅支持`js`文件类型 |
| [jsdoc2mdOptions] | [<code>Jsdoc2mdOptions</code>](#Jsdoc2mdOptions) |  | jsdocToMarkdown配置参数 |
| [codesOptions] | [<code>GetFilesCodeOptions</code>](#GetFilesCodeOptions) |  | 获取源代码的文件路径配置参数 |
| [jsdocEngineOptions] | <code>object</code> |  | jsdoc解析引擎的配置，实际上是`jsdoc.conf.js`的整合， 也可以使用  `RenderOptions.jsdoc2mdOptions.configure`字段来指定本地的jsdoc配置 配置选项[👉参考文档](https://jsdoc.app/about-configuring-jsdoc.html) |
| [helpers] | <code>object</code> |  | 注入ejs模板的`helpers`对象，提供模板使用的帮助函数和变量 |
| [presets] | <code>Array.&lt;module:GenDoc~RenderOptions&gt;</code> |  | 基于preset机制实现配置支持预设的功能， 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config)`PresetUtils.getDeepPresetMerge` |
| [noDefault] | <code>boolean</code> |  | 取消合并默认配置 |
| [modify] | <code>module:@ads/node-utils~ConfigModify</code> |  | 将默认配置和preset合并后生成的config再次处理的钩子 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config) |

<a name="GetFilesCodeResult"></a>

### GetFilesCodeResult : <code>Object.&lt;string, string&gt;</code>
获取文件的内容的返回值类型，key是文件的extname

**性质**: 类型声明
<a name="GetFilesCodeOptions"></a>

### GetFilesCodeOptions : <code>object</code>
获取源代码的文件路径配置参数

**性质**: 类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| dir | <code>string</code> | glob路径 |
| files | <code>Array.&lt;string&gt;</code> | glob文件名称数组 |

<a name="Jsdoc2mdOptions"></a>

### Jsdoc2mdOptions : <code>object</code>
jsdocToMarkdown配置参数，具体可[👉参考文档](https://github.com/jsdoc2md/jsdoc-to-markdown/blob/master/docs/API.md)

**性质**: 类型声明



## 默认doc模板
```ejs
<%
const {docs, codes, helpers, pkg} = locals
%>
# <%- pkg.name %>
**版本** ：<%- pkg.version %>
<%- pkg.description %>

## 快速开始

### 安装
<%  %>```bash
npm i <%- pkg.name %>
<%  %>```<% if(helpers.importCode) { %>

### 引入
<%  %>```js
<%- helpers.importCode %>
<%  %>```
<% } %><% if(helpers.exportCode) { %>
### 导出
<%  %>```js
<%- helpers.exportCode %>
<%  %>```
<% } %><% if(codes&&codes.length) { %>

## 代码演示
<%-
    helpers.renderCode
        &&helpers.renderCode(codes, helpers.extSort, helpers.extTrans)
%>
<% } %><% if(docs) { %>

## API文档
<%- docs %>
<% } %>

```


## 默认配置

> 当前`__dirname`为`@ads/cli-plugin-doc/lib/utils`

```js
const path = require('path');
const defaultTemplate = path.resolve(__dirname, '../template/template.ejs');

const defaultConfig = {
    template: defaultTemplate,
    jsdoc2mdOptions: {
        partial: [path.resolve(__dirname, '../dmdRewrite/partials/*.hbs')],
        helper: [path.resolve(__dirname, '../dmdRewrite/helpers/*.js')],
        'heading-depth': 3,
    },
    // 默认`jsdocEngineOptions`配置一般只能增加无法删除，
    // 但是可以在配置noDefault来去除默认配置
    jsdocEngineOptions: {
        plugins: [
            require.resolve('jsdoc-tsimport-plugin'),
        ],
    },
    helpers: {
        /**
         * 将codes渲染成md代码片段
         *
         * @param {import('../index.js').GetFilesCodeResult[]} codes `GenDoc.getFilesCode`函数获取到的codes数组
         * @param {string[]} [extSort= ['md', 'vue', 'jsx', 'js']] 优先并且按照`extSort`数组顺序获取遍历codes
         * @param {Object<string,string>} [extTrans={vue:'html'}] ext转换的映射map
         * 简单示例`{vue:'html'}`
         * @returns {string}
         */
        renderCode(codes, extSort = ['md', 'vue', 'jsx', 'js'], extTrans = { vue: 'html' }) {
            let result = '';
            codes && codes.forEach((item) => {
                extSort.concat(Object.keys(item).filter(ext => !extSort.includes(ext))).forEach((ext) => {
                    const code = item[ext];
                    if (code) {
                        code.forEach(c => {
                            if (ext === 'md') {
                                result += c + '\n';
                            } else {
                                const _ext = extTrans[ext] || ext;
                                result += `\`\`\`${_ext}\n` + c + '\n```\n';
                            }
                        });
                    }
                });
            });
            return result;
        },
        extSort: ['md', 'vue', 'jsx', 'js'],
        extTrans: { vue: 'html' },
    },
};

module.exports = defaultConfig;

```

