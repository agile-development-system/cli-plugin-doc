# @ads/cli-plugin-doc
**版本** ：1.0.3-2
通用注释转markdown文档生成器,目标是支持所有类型的文件

## 快速开始

### 安装
```bash
npm i @ads/cli-plugin-doc
```

### 命令行使用文档

```
Usage: ads-doc [options]

通用注释转markdown文档生成器,目标是支持所有类型的文件

Options:
  <files...>                          jsdoc入口文件glob格式路径描述(需要用引号包裹避免解析失败)，相对于cwd目录
  -o,--output <output>                doc文档渲染导出的文件名称路径，相对于cwd目录
  -c,--config <config>                配置文件路径，相对于cwd目录，仅支持js文件类型 (default:
                                      "ads.doc.config.js")
  -t,--template <template>            ejs渲染的模板相对于cwd的路径或者绝对路径
  --cd,--codes-dir <codesDir>         glob格式路径，代码演示示例的对应文件夹路径，路径需要到某个具体示例的对应文件夹
  --cf,--codes-files <codesFiles...>  glob格式路径，相对于codesDir的代码演示文件夹的文件路径描述
  -v,--version                        查看版本号
  -h, --help                          查看帮助信息

注意：每个包含通配符的路径都需要用引号包裹，否则会被系统提前解析导致意料之外的错误

文档查看：https://gitee.com/agile-development-system/cli-plugin-doc
@ads/cli-plugin-doc@1.0.3-2 /Users/jinyang/code/ads/cli-plugin-doc

```



## 代码演示
```js
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

```
```js
const { expect, test } = require('@jest/globals');
const GenDoc = require('@ads/cli-plugin-doc');
const config = require('../__mock__/index');
const path = require('path');
test('GenDoc render', async () => {
    const res = await GenDoc.render(await config());
    expect(typeof res === 'string').toBe(true);
});

test('GenDoc render output & use ads.doc.config.js', async () => {
    const res = await GenDoc.render({
        output: path.resolve(__dirname, '../../.temp/README.md'),
    });
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
<a name="CmdParser"></a>

### CmdParser
基于`commander.js`封装的命令行解析工具库

**性质**: 类
<a name="CmdParser.optionParseByConfig"></a>

#### CmdParser.optionParseByConfig(program, config)
基于config配置Command实例

**性质**: [<code>CmdParser</code>](#CmdParser)的静态方法

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| program | [<code>Command</code>](#Command) | command实例 |
| config | [<code>CmdConfig</code>](#CmdConfig) | 命令行解析配置 |

<a name="CmdParser.cmdParser"></a>

#### CmdParser.cmdParser(options)
基于配置文件的命令行解析器

**性质**: [<code>CmdParser</code>](#CmdParser)的静态方法

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | <code>object</code> | 函数参数 |
| options.root | <code>string</code> | 当前命令行npm包根目录 |
| [options.isCore] | <code>boolean</code> | 是否是@ads/cli调用 |
| [options.cmd] | <code>string</code> | 命令名称，命令调用必填 |

<a name="GenDoc"></a>

### GenDoc
GenDoc 基于注释和可运行的示例代码自动生成文档的强大工具类

#### 引入
```js
const GenDoc = require('@ads/cli-plugin-doc');
```

**性质**: 类
<a name="GenDoc.render"></a>

#### GenDoc.render(options) ⇒ <code>Promise.&lt;string&gt;</code>
基于ejs，用模板渲染文档

**性质**: [<code>GenDoc</code>](#GenDoc)的静态方法
**返回值**: <code>Promise.&lt;string&gt;</code> - 异步返回基于ejs模板渲染的文档文本

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | [<code>RenderOptions</code>](#RenderOptions) | 获取用来渲染模板的数据 |

<a name="GenDoc.getRenderData"></a>

#### GenDoc.getRenderData(options, [needMergeConfig]) ⇒ [<code>Promise.&lt;GetRenderDataResult&gt;</code>](#GetRenderDataResult)
获取用来渲染模板的数据（jsdoc生成的文档和示例代码的内容）

**性质**: [<code>GenDoc</code>](#GenDoc)的静态方法

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| options | [<code>RenderOptions</code>](#RenderOptions) |  | 配置参数 |
| [needMergeConfig] | <code>boolean</code> | <code>true</code> | 是否需要调用`_mergeToDefaultConfig`， options已经是merge处理过的就不需要调用,否则不推荐传入`false` 会导致别名不支持 |

<a name="GenDoc.getFilesCode"></a>

#### GenDoc.getFilesCode(options) ⇒ <code>Promise.&lt;Array.&lt;GetFilesCodeResult&gt;&gt;</code>
基于glob的文件遍历函数，返回文件对应内容的数组，
以文件夹为单位返回文件内容对象，key是文件的extname

**性质**: [<code>GenDoc</code>](#GenDoc)的静态方法

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | [<code>GetFilesCodeOptions</code>](#GetFilesCodeOptions) | 获取源代码的文件路径配置参数 |

<a name="Command"></a>

### Command : <code>module:commander~Command</code>
`commander.js`实例

**性质**: 类型声明
<a name="CmdConfig"></a>

### CmdConfig : <code>object</code>
命令行解析配置

**性质**: 类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| cmd | <code>string</code> | 作为插件时为子命令名称，单独使用时`ads-<cmd>`为命令行程序名称 |
| desc | <code>string</code> | 描述 |
| alias | <code>string</code> | 此命令的别名，只在插件调用时有效 |
| opts | [<code>Array.&lt;OptConfig&gt;</code>](#OptConfig) | option配置项描述 |

<a name="OptConfig"></a>

### OptConfig : <code>object</code>
命令行option解析配置

**性质**: 类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| opt | <code>string</code> | option字段配置 |
| desc | <code>string</code> | 描述 |
| default | <code>string</code> \| <code>boolean</code> | 默认值 |
| required | <code>boolean</code> | 是否是必填参数 |

<a name="GetRenderDataResult"></a>

### GetRenderDataResult : <code>object</code>
函数[getRenderData](getRenderData)的返回值

**性质**: 类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| docs | <code>string</code> | 源码使用jsdoc渲染后的markdown文本 |
| codes | [<code>Array.&lt;GetFilesCodeResult&gt;</code>](#GetFilesCodeResult) | 获取到的代码内容 |

<a name="RenderOptions"></a>

### RenderOptions : <code>object</code>
渲染函数的配置参数

**性质**: 类型声明
**属性**

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| files | <code>Array.&lt;string&gt;</code> |  | `jsdoc2mdOptions.files`的别名 |
| output | <code>fs.PathLike</code> |  | doc文档渲染导出的文件名称路径，相对于cwd目录 |
| template | <code>string</code> |  | ejs渲染的模板相对于cwd的路径或者绝对路径 |
| [codesDir] | <code>string</code> |  | `codesOptions.dir`的别名 |
| [codesFiles] | <code>Array.&lt;string&gt;</code> |  | `codesOptions.codesFiles`的别名 |
| [conifg] | <code>fs.PathLike</code> | <code>ads.doc.config.js</code> | 配置文件路径，默认为运行目录下的`ads.doc.config.js`,仅支持`js`文件类型 |
| [jsdoc2mdOptions] | [<code>Jsdoc2mdOptions</code>](#Jsdoc2mdOptions) |  | jsdocToMarkdown配置参数 |
| [codesOptions] | [<code>GetFilesCodeOptions</code>](#GetFilesCodeOptions) |  | 获取源代码的文件路径配置参数 |
| [jsdocEngineOptions] | <code>object</code> |  | jsdoc解析引擎的配置，实际上是`jsdoc.conf.js`的整合， 也可以使用  `RenderOptions.jsdoc2mdOptions.configure`字段来指定本地的jsdoc配置 配置选项[👉参考文档](https://jsdoc.app/about-configuring-jsdoc.html) |
| [helpers] | <code>object</code> |  | 注入ejs模板的`helpers`对象，提供模板使用的帮助函数和变量 |
| [presets] | [<code>Array.&lt;RenderOptions&gt;</code>](#RenderOptions) |  | 基于preset机制实现配置支持预设的功能， 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config)`PresetUtils.getDeepPresetMerge` |
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
        &&helpers.renderCode(codes, ...[helpers.extSort, helpers.extTrans].filter(Boolean))
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
        'no-cache': true,
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
    },
};

module.exports = defaultConfig;

```

