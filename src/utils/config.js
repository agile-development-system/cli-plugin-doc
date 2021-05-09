/*
 * @Author: 锦阳
 * @Create: 2021年04月18日
 */
const path = require('path');
const defaultTemplate = path.resolve(__dirname, '../template/template.ejs');
const { FastFs } = require('@ads/node-utils');
const defaultConfig = {
    template: defaultTemplate,
    Jsdoc2mdOptions: {
        partial: [path.resolve(__dirname, '../partials/*.hbs')],
        helper: [path.resolve(__dirname, '../helpers/*.js')],
    },
    helpers: {
        renderCode(codes) {
            let result = '';
            codes && codes.forEach((item) => {
                Object.keys(item).forEach((ext) => {
                    const code = item[ext];
                    code.forEach(c => {
                        if (ext === 'md') {
                            result += c + '\n';
                        } else {
                            result += `\`\`\`${ext}\n` + c + '\n```\n';
                        }
                    });
                });
            });
            return result;
        },
        getPathStatSync: FastFs.getPathStatSync,
    },
    modify(config) {
    },
};

module.exports = defaultConfig;
