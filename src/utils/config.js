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
