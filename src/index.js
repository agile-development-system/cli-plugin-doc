const { filesForEach } = require('./utils/common');
const doc = require('jsdoc-to-markdown');
module.exports = async (entry, options) => {
    const res = {};
    await Promise.all(filesForEach(entry, options.globOptions, async file => {
        res[file] = await doc.render({
            files: file,
        });
    }));
    return res;
};
