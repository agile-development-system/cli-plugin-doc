
# @ads/cli-plugin-doc
**版本** ：1.0.0
通用注释转markdown文档生成器,目标是支持所有类型的文件

## 快速开始

### 安装
```bash
npm i @ads/cli-plugin-doc
```

## 代码演示
<!--
 * @Author: 锦阳
 * @Create: 2021年05月12日
-->
#### 测试示例
```html
<template>

</template>

<script>
export default {

}
</script>

<style>

</style>
```
```jsx
function Test(params) {
    return <div></div>
}
```
```js
/*
 * @Author: 锦阳
 * @Create: 2021年05月12日
 */
module.exports = '1000';

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
| options | [<code>RenderOptions</code>](#module_GenDoc..RenderOptions) | 获取用来渲染模板的数据 |

<a name="module_GenDoc.getRenderData"></a>

#### GenDoc.getRenderData(options, [needMergeConfig]) ⇒ [<code>Promise.&lt;GetRenderDataResult&gt;</code>](#module_GenDoc..GetRenderDataResult)
获取用来渲染模板的数据（jsdoc生成的文档和示例代码的内容）

**性质**: [<code>GenDoc</code>](#module_GenDoc)的静态方法

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| options | [<code>RenderOptions</code>](#module_GenDoc..RenderOptions) |  | 配置参数 |
| [needMergeConfig] | <code>boolean</code> | <code>true</code> | 是否需要调用`needMergeConfig`， options已经是merge处理过的就不需要调用 |

<a name="module_GenDoc.getFilesCode"></a>

#### GenDoc.getFilesCode(options) ⇒ <code>Promise.&lt;Array.&lt;module:GenDoc~GetFilesCodeResult&gt;&gt;</code>
基于glob的文件遍历函数，返回文件对应内容的数组，
以文件夹为单位返回文件内容对象，key是文件的extname

**性质**: [<code>GenDoc</code>](#module_GenDoc)的静态方法

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | [<code>GetFilesCodeOptions</code>](#GetFilesCodeOptions) | 获取源代码的文件路径配置参数 |

<a name="module_GenDoc..GetRenderDataResult"></a>

#### GenDoc~GetRenderDataResult : <code>object</code>
函数[getRenderData](getRenderData)的返回值

**性质**: [<code>GenDoc</code>](#module_GenDoc)的内部类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| docs | <code>string</code> | 源码使用jsdoc渲染后的markdown文本 |
| codes | [<code>Array.&lt;GetFilesCodeResult&gt;</code>](#module_GenDoc..GetFilesCodeResult) | 获取到的代码内容 |

<a name="module_GenDoc..RenderOptions"></a>

#### GenDoc~RenderOptions : <code>object</code>
渲染函数的配置参数

**性质**: [<code>GenDoc</code>](#module_GenDoc)的内部类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| files | <code>Array.&lt;string&gt;</code> | `jsdoc2mdOptions.files`的别名 |
| codesDir | <code>string</code> | `codesOptions.dir`的别名 |
| codesFiles | <code>Array.&lt;string&gt;</code> | `codesOptions.codesFiles`的别名 |
| template | <code>string</code> | ejs渲染的模板相对于cwd的路径或者绝对路径 |
| jsdoc2mdOptions | [<code>Jsdoc2mdOptions</code>](#Jsdoc2mdOptions) | jsdocToMarkdown配置参数 |
| codesOptions | [<code>GetFilesCodeOptions</code>](#GetFilesCodeOptions) | 获取源代码的文件路径配置参数 |
| jsdocEngineOptions | <code>object</code> | jsdoc解析引擎的配置，实际上是`jsdoc.conf.js`的整合， 也可以使用  `RenderOptions.jsdoc2mdOptions.configure`字段来指定本地的jsdoc配置 配置选项[👉参考文档](https://jsdoc.app/about-configuring-jsdoc.html) |
| helpers | <code>object</code> | 注入ejs模板的`helpers`对象，提供模板使用的帮助函数和变量 |
| presets | [<code>Array.&lt;RenderOptions&gt;</code>](#module_GenDoc..RenderOptions) | 基于preset机制实现配置支持预设的功能， 具体[👉参考文档](https://gitee.com/agile-development-system/node-utils#presetutilsgetdeeppresetmergeconfig--config)`PresetUtils.getDeepPresetMerge` |
| modify | <code>RenderOptionsModify</code> | 将默认配置和preset合并后生成的config再次处理的钩子 |

<a name="module_GenDoc..RenderOptionsModify"></a>

#### GenDoc~RenderOptionsModify ⇒ [<code>RenderOptions</code>](#module_GenDoc..RenderOptions)
**性质**: [<code>GenDoc</code>](#module_GenDoc)的内部类型声明

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| config | [<code>RenderOptions</code>](#module_GenDoc..RenderOptions) | 将默认配置和preset合并后生成的config |

<a name="module_GenDoc..GetFilesCodeResult"></a>

#### GenDoc~GetFilesCodeResult : <code>Object.&lt;string, string&gt;</code>
获取文件的内容的返回值类型，key是文件的extname

**性质**: [<code>GenDoc</code>](#module_GenDoc)的内部类型声明
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
/*
 * @Author: 锦阳
 * @Create: 2021年04月18日
 */
const path = require('path');
const defaultTemplate = path.resolve(__dirname, '../template/template.ejs');

const defaultConfig = {
    output: 'README.md',
    template: defaultTemplate,
    jsdoc2mdOptions: {
        partial: [path.resolve(__dirname, '../partials/*.hbs')],
        helper: [path.resolve(__dirname, '../helpers/*.js')],
        'heading-depth': 3,
    },
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

