/*
 * @Author: 锦阳
 * @Create: 2021年04月22日
 */

const doc = require('jsdoc-to-markdown');
/**
 *  渲染jsdoc文档
 *
 * @param {Jsdoc2mdOptions} options jsdocToMarkdown配置参数
 * @returns {Promise<string>} 异步返回jsdoc文档文本
 * @ignore
 */
function jsdocRender(options) {
    return doc.render(options);
}

module.exports = jsdocRender;

/**
 * jsdocToMarkdown配置参数，具体可[👉参考文档](https://github.com/jsdoc2md/jsdoc-to-markdown/blob/master/docs/API.md)
 *
 * @typedef {object} Jsdoc2mdOptions
 */
