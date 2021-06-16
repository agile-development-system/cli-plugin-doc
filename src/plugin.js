/*
 * @Author: 锦阳
 * @Create: 2021年05月12日
 */
const GenDoc = require('./index');
const ora = require('ora');

exports.doc = async (options) => {
    const spinner = ora('正在生成文档').start();
    try {
        const res = await GenDoc.render(options);
        spinner.succeed('文档生成成功');
        if (res) {
            console.log(res);
        }
    } catch (error) {
        spinner.fail(error.message);
        return Promise.reject(error);
    }
};
