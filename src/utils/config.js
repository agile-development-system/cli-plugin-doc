/*
 * @Author: 锦阳
 * @Create: 2021年04月18日
 */
const path = require('path');
const { FastFs } = require('@ads/node-utils');
const defaultTemplate = path.resolve(__dirname, '../template/template.ejs');

const defaultConfig = {
    template: defaultTemplate,
    Jsdoc2mdOptions: {
        partial: [path.resolve(__dirname, '../partials/*.hbs')],
        helper: [path.resolve(__dirname, '../helpers/*.js')],
        'heading-depth': 3,
    },
    helpers: {
        /**
         * 将codes渲染成md代码片段
         *
         * @param {import('../index.js').GetFilesCodeResult[]} codes `GenDoc.getFilesCode`函数获取到的codes数组
         * @param {string[]} extSort 优先并且按照`extSort`数组顺序获取遍历codes
         * @param {Object<string,string>} extTrans ext转换的映射map
         * 简单示例`{vue:'html'}`
         * @returns {string}
         */
        renderCode(codes, extSort = [], extTrans = []) {
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
        getPathStatSync: FastFs.getPathStatSync,
    },
};

module.exports = defaultConfig;
