# @agds/cli-plugin-doc

**版本** ：1.0.9

通用注释转markdown文档生成器,目标是支持所有类型的文件

## 快速开始

### 安装

```bash
npm i -D @agds/cli-plugin-doc
```

### 命令行使用文档


```
Usage: agds-doc [options]

agds系统doc文档生成器

Options:
  <files...>                          jsdoc入口文件glob格式路径描述(需要用引号包裹避免解析失败)，相对于cwd目录
  -o,--output <output>                doc文档渲染导出的文件名称路径，相对于cwd目录
  -c,--config <config>                配置文件路径，相对于cwd目录，仅支持js文件类型 (default:
                                      "agds.doc.config.js")
  -t,--template <template>            ejs渲染的模板相对于cwd的路径或者绝对路径
  --cd,--codes-dir <codesDir>         glob格式路径，代码演示示例的对应文件夹路径，路径需要到某个具体示例的对应文件夹
  --cf,--codes-files <codesFiles...>  glob格式路径，相对于codesDir的代码演示文件夹的文件路径描述
  --no-default                        禁止使用默认配置，默认配置相对比较通用，大部分情况不需要禁止，当默认配置和你的配置冲突时可以使用此选项
  -v,--version                        查看版本号
  -h, --help                          查看帮助信息

注意：每个包含通配符的路径都需要用引号包裹，否则会被系统提前解析导致意料之外的错误

文档查看：https://gitee.com/agile-development-system/cli-plugin-doc
@agds/cli-plugin-doc@1.0.2 /Users/jinyang/code/ads/cli-plugin-doc/node_modules/@agds/cli-plugin-doc

```





### 配置文件

默认为当前目录下的`agds.doc.config.js`，自动合并[默认配置](#defaultConfig)

可以通过命令行参数`-c --config <config>`或者node api的`options.config` 来指定配置文件名称

可以通过命令行参数`--no-default`或者node api的`options.default=false` 来禁止使用默认配置，默认配置相对比较通用，大部分情况不需要禁止，当默认配置和你的配置冲突时可以使用此选项

配置文件导出类型为[👉`RenderOptions`](#RenderOptions),理论上支持所有的renderOption，由默认模板提供的`helpers`配置请看[👉默认模板支持的helpers](#DefaultHelpers)、[👉默认模板](#defaultTemplate)




## 代码演示

```js

const GenDoc = require('@agds/cli-plugin-doc');
/**
 * render配置生成
 *
 * @param {object} [options={}] 选项
 * @param {boolean} [options.needDirError] 是否需要触发文件路径错误
 * @param {boolean} [options.noFiles] 是否需要去除files选项
 * @param {boolean} [options.noDefault] 是否取消default配置
 * @param {boolean} [options.noCodes] 是否去除codes相关配置
 * @returns {import('../../src/index').RenderOptions}
 */
module.exports = async ({ needDirError, noFiles, noDefault, noCodes } = {}) => {
    const [template, defaultConfig, cliUsages] = (await Promise.all([
        GenDoc.getFilesCode({ dir: './src/template', files: ['*'] }),
        GenDoc.getFilesCode({ dir: './src/utils', files: ['config.js'] }),
        GenDoc.getCliUsages(),
    ]));
    return {
        files: noFiles ? null : ['./src/**/*.js'],
        ...(noCodes
            ? {}
            : {
                codesDir: needDirError ? './aaa' : './exa',
                codesFiles: ['*'],
            }
        ),
        config: './agds.doc.conf.js',
        noDefault,
        jsdocEngineOptions: noDefault && {
            plugins: [
                require.resolve('jsdoc-tsimport-plugin'),
            ],
        },
        helpers: {
            template,
            defaultConfig,
            cliUsages,
        },
    };
};
```
```js
const { expect, test } = require('@jest/globals');
const GenDoc = require('@agds/cli-plugin-doc');
const config = require('../__mock__/index');
const path = require('path');
test('GenDoc render', async () => {
    const res = await GenDoc.render(await config());
    expect(typeof res === 'string').toBe(true);
});

test('GenDoc render output & use agds.doc.config.js', async () => {
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

test('GenDoc getRenderData nodefault', async () => {
    const res = await GenDoc.getRenderData(await config({ noDefault: true }));
    expect(typeof res === 'object').toBe(true);
});

test('GenDoc getRenderData', async () => {
    const res = await GenDoc.getRenderData(await config(), false);
    expect(typeof res === 'object').toBe(true);
});

test('GenDoc getFileContent', () => {
    const res = GenDoc.getFileContent('./README.md');
    expect(typeof res === 'string').toBe(true);
});
```



## API文档
<a name="GenDoc"></a>

### GenDoc
GenDoc 基于注释和可运行的示例代码自动生成文档的强大工具类

#### 引入
```js
const GenDoc = require('@agds/cli-plugin-doc');
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

<a name="GenDoc.getCliUsages"></a>

#### GenDoc.getCliUsages() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
获取命令行使用帮助文档
建议提前确保全局使用了最新的脚本
函数为异步函数，注意不能作为ejs帮助函数传入，可以获取返回值后，将返回值作为helpers的变量传入

**性质**: [<code>GenDoc</code>](#GenDoc)的静态方法
<a name="GenDoc.getFileContent"></a>

#### GenDoc.getFileContent(filename) ⇒ <code>string</code>
读取文件内容

**性质**: [<code>GenDoc</code>](#GenDoc)的静态方法

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| filename | <code>string</code> | 相对于运行目录的文件路径 |

<a name="GenDoc.renderCode"></a>

#### GenDoc.renderCode(codes, [extSort], [extTrans]) ⇒ <code>string</code>
将codes渲染成md代码片段

**性质**: [<code>GenDoc</code>](#GenDoc)的静态方法

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| codes | [<code>Array.&lt;GetFilesCodeResult&gt;</code>](#GetFilesCodeResult) |  | `GenDoc.getFilesCode`函数获取到的codes数组 |
| [extSort] | <code>Array.&lt;string&gt;</code> | <code>[&#x27;md&#x27;, &#x27;vue&#x27;, &#x27;jsx&#x27;, &#x27;js&#x27;]</code> | 优先并且按照`extSort`数组顺序获取遍历codes |
| [extTrans] | <code>Object.&lt;string, string&gt;</code> | <code>{vue:&#x27;html&#x27;}</code> | ext转换的映射map 简单示例`{vue:'html'}` |

<a name="GetRenderDataResult"></a>

### GetRenderDataResult : <code>object</code>
函数[GenDoc.getRenderData](#GenDoc.getRenderData)的返回值

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
| [conifg] | <code>fs.PathLike</code> | <code>agds.doc.config.js</code> | 配置文件路径，默认为运行目录下的`agds.doc.config.js`,仅支持`js`文件类型 |
| [default] | <code>boolean</code> |  | 是否合并默认配置，一般我们认为您是需要默认配置的，当默认配置和你的需求冲突时可以设置为`false` |
| [jsdoc2mdOptions] | [<code>Jsdoc2mdOptions</code>](#Jsdoc2mdOptions) |  | jsdocToMarkdown配置参数 |
| [codesOptions] | [<code>GetFilesCodeOptions</code>](#GetFilesCodeOptions) |  | 获取源代码的文件路径配置参数 |
| [jsdocEngineOptions] | <code>object</code> |  | jsdoc解析引擎的配置，实际上是`jsdoc.conf.js`的整合， 也可以使用  `RenderOptions.jsdoc2mdOptions.configure`字段来指定本地的jsdoc配置 配置选项[👉参考文档](https://jsdoc.app/about-configuring-jsdoc.html) |
| [helpers] | [<code>DefaultHelpers</code>](#DefaultHelpers) |  | 注入ejs模板的`helpers`对象，提供模板使用的帮助函数和变量，配合模板使用 |
| [presets] | [<code>Array.&lt;RenderOptions&gt;</code>](#RenderOptions) |  | 基于preset机制实现配置支持预设的功能， 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config)`PresetUtils.getDeepPresetMerge` |
| [noDefault] | <code>boolean</code> |  | 取消合并默认配置 |
| [modify] | <code>module:@agds/node-utils~ConfigModify</code> |  | 将默认配置和preset合并后生成的config再次处理的钩子 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config) |

<a name="GetFilesCodeResult"></a>

### GetFilesCodeResult : <code>Object.&lt;string, string&gt;</code>
获取文件的内容的返回值类型，key是文件的extname

**性质**: 类型声明
<a name="DefaultHelpers"></a>

### DefaultHelpers : <code>Object</code>
默认模板所支持的`helpers`属性

**性质**: 类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| [installCode] | <code>string</code> | 安装脚本，bash脚本，默认为`npm i ${pkg.name}`，如不符合要求，可以通过此字段自行修改 |
| [devInstall] | <code>boolean</code> | 是否是作为开发依赖下载，`true`时，默认下载代码自动拼接npm `-D` 参数 |
| [importCode] | <code>string</code> | 引入代码示例，js字符串 |
| [exportCode] | <code>string</code> | 导出代码，js字符串 |
| [cliUsages] | <code>Array.&lt;string&gt;</code> | cli命令行使用帮助文档，格式类似`agds-doc -h`的输出内容 |
| [remark] | <code>string</code> | 文档备注信息，md字符串 |
| [renderCode] | [<code>renderCode</code>](#GenDoc.renderCode) | 将`GenDoc.getFileCodes`的返回值渲染成对应的代码段 |
| [postfixes] | [<code>Array.&lt;Postfix&gt;</code>](#Postfix) | 后缀内容数组 |

<a name="Postfix"></a>

### Postfix : <code>Object</code>
后缀内容类型

**性质**: 类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| [id] | <code>string</code> | 锚点的名称，填写之后可以支持 `href=\`#${id}\``锚点定位 |
| [title] | <code>string</code> | 内容的标题 |
| [desc] | <code>string</code> | 内容的描述 |
| [content] | <code>string</code> | 内容的正文 |

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

 <!-- 渲染后缀内容  -->



<a name="defaultTemplate"></a>


## 默认文档渲染模板

```ejs
<%
const {docs, codes, helpers, pkg} = locals
%># <%- pkg.name %>

**版本** ：<%- pkg.version %>

<%- pkg.description %>

## 快速开始

### 安装

<%  %>```bash
<%- helpers.installCode || 'npm i '+ (helpers.devInstall? '-D ' : '') + pkg.name %>
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
<% } %><% if(helpers.cliUsages&&helpers.cliUsages.length) { %>

### 命令行使用文档

<% helpers.cliUsages.forEach(usage=>{ %>
<%  %>```
<%- usage %>
<%  %>```
<% }) %>
<% } %>

<% if(helpers.remark) { %>

<%- helpers.remark %>
<% } %><% if(codes&&codes.length) { %>

## 代码演示

<%-
    helpers.renderCode
        &&helpers.renderCode(codes)
%>
<% } %><% if(docs) { %>

## API文档
<%- docs %>
<% } %><% if(helpers.postfixes&&helpers.postfixes.length) { %> <!-- 渲染后缀内容  -->
<% helpers.postfixes.forEach(postfix=>{ %>
<% if(postfix.id) { %>

<a name="<%- postfix.id %>"></a>
<% } %><% if(postfix.title) { %>

## <%- postfix.title %>
<% } %><% if(postfix.desc) { %>
> <%- postfix.desc %>
<% } %><% if(postfix.content) { %>
<%- postfix.content %>
<% }
})
} %>


```




<a name="defaultConfig"></a>


## 默认文档渲染配置

> 当前`__dirname`为`@agds/cli-plugin-doc/lib/utils`

```js
const path = require('path');
const defaultTemplate = path.resolve(__dirname, '../template/template.ejs');
const renderCode = require('./renderCode');
const defaultConfig = {
    template: defaultTemplate,
    jsdoc2mdOptions: {
        // 'no-cache': true,
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
        renderCode,
    },
};

module.exports = defaultConfig;
```



