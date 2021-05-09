
# @ads/cli-plugin-doc
**版本** ：1.0.0
通用注释转markdown文档生成器,目标是支持所有类型的文件

## 快速开始

### 安装
```bash
npm i @ads/cli-plugin-doc
```

## API文档
<a name="module_GenDoc"></a>

## GenDoc
GenDoc 基于注释和可运行的示例代码自动生成文档的强大工具类

### 引入
```js
const GenDoc = require('@ads/cli-plugin-doc');
```

<a name="module_GenDoc.render"></a>

### GenDoc.render(options) ⇒ <code>Promise.&lt;string&gt;</code>
基于ejs，用模板渲染文档

**性质**: [<code>GenDoc</code>](#module_GenDoc)的静态方法
**返回值**: <code>Promise.&lt;string&gt;</code> - 异步返回基于ejs模板渲染的文档文本

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | [<code>RenderObtions</code>](#module_GenDoc..RenderObtions) | 获取用来渲染模板的数据 |

<a name="module_GenDoc.getRenderData"></a>

### GenDoc.getRenderData(options) ⇒ [<code>Promise.&lt;GetRenderDataResult&gt;</code>](#module_GenDoc..GetRenderDataResult)
获取用来渲染模板的数据（jsdoc生成的文档和示例代码的内容）

**性质**: [<code>GenDoc</code>](#module_GenDoc)的静态方法

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | [<code>RenderObtions</code>](#module_GenDoc..RenderObtions) | 配置参数 |

<a name="module_GenDoc.getFilesCode"></a>

### GenDoc.getFilesCode(options) ⇒ <code>Promise.&lt;Array.&lt;module:GenDoc~GetFilesCodeResult&gt;&gt;</code>
基于glob的文件遍历函数，返回文件对应内容的数组，
以文件夹为单位返回文件内容对象，key是文件的extname

**性质**: [<code>GenDoc</code>](#module_GenDoc)的静态方法

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | [<code>GetFilesCodeOptions</code>](#GetFilesCodeOptions) | 获取源代码的文件路径配置参数 |

<a name="module_GenDoc..GetRenderDataResult"></a>

### GenDoc~GetRenderDataResult : <code>object</code>
函数[getRenderData](getRenderData)的返回值

**性质**: [<code>GenDoc</code>](#module_GenDoc)的innertypedef
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| docs | <code>string</code> | 源码使用jsdoc渲染后的markdown文本 |
| codes | [<code>Array.&lt;GetFilesCodeResult&gt;</code>](#module_GenDoc..GetFilesCodeResult) | 获取到的代码内容 |

<a name="module_GenDoc..RenderObtions"></a>

### GenDoc~RenderObtions : <code>object</code>
渲染函数的配置参数

**性质**: [<code>GenDoc</code>](#module_GenDoc)的innertypedef
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| Jsdoc2mdOptions | [<code>Jsdoc2mdOptions</code>](#Jsdoc2mdOptions) | jsdocToMarkdown配置参数 |
| codesOptions | [<code>GetFilesCodeOptions</code>](#GetFilesCodeOptions) | 获取源代码的文件路径配置参数 |

<a name="module_GenDoc..GetFilesCodeResult"></a>

### GenDoc~GetFilesCodeResult : <code>Object.&lt;string, string&gt;</code>
获取文件的内容的返回值类型，key是文件的extname

**性质**: [<code>GenDoc</code>](#module_GenDoc)的innertypedef
<a name="GetFilesCodeOptions"></a>

## GetFilesCodeOptions : <code>object</code>
获取源代码的文件路径配置参数

**性质**: 类型声明
**属性**

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| dir | <code>string</code> | glob路径 |
| files | <code>Array.&lt;string&gt;</code> | glob文件名称数组 |

<a name="Jsdoc2mdOptions"></a>

## Jsdoc2mdOptions : <code>object</code>
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
<%- helpers.renderCode&&helpers.renderCode(codes) %>
<% } %><% if(docs) { %>

## API文档
<%- docs %>
<% } %>

```

