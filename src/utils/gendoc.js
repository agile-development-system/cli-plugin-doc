/*
 * @Author: 锦阳
 * @Create: 2021年04月22日
 */
const { filesForEach } = require('./common');
const doc = require('jsdoc-to-markdown');
module.exports = async (options) => {
    const res = {};
    await Promise.all(filesForEach(options.files, async file => {
        res[file] = await doc.render({
            files: file,
        });
    }));
    return res;
};
