/*
 * @Author: 锦阳
 * @Create: 2021年05月31日
 */
/* istanbul ignore next */
/**
 * 将codes渲染成md代码片段
 *
 * @param {Array<import('../index.js').GetFilesCodeResult>} codes `GenDoc.getFilesCode`函数获取到的codes数组
 * @param {string[]} [extSort= ['md', 'vue', 'jsx', 'js']] 优先并且按照`extSort`数组顺序获取遍历codes
 * @param {Object<string,string>} [extTrans={vue:'html'}] ext转换的映射map
 * 简单示例`{vue:'html'}`
 * @returns {string}
 * @alias GenDoc.renderCode
 */
function renderCode(codes, extSort = ['md', 'vue', 'jsx', 'js'], extTrans = { vue: 'html' }) {
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
}

module.exports = renderCode;
