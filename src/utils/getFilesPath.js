/*
 * @Author: 锦阳
 * @Create: 2021年04月25日
 */

const FileSet = require('file-set');
const { FastPath } = require('@agds/node-utils');
const path = require('path');
/**
 * 基于glob的文件遍历函数，返回基于目录分类的二维数组
 *
 * @param {GetFilesCodeOptions} options 配置参数
 * @returns {string[][]}
 * @ignore
 */
function getFilesPath({ dir, files }) {
    const _dirs = new FileSet(FastPath.getCwdPath(dir)).dirs;
    if (!(_dirs && _dirs.length > 0)) {
        throw new Error('未匹配到任何目录，请确认输入路径');
    }
    return _dirs.map(dir =>
        (
            new FileSet(
                files
                    .map(file =>
                        path.resolve(dir, file)))
        )
            .files);
}

module.exports = getFilesPath;

/**
 * 获取源代码的文件路径配置参数
 *
 * @typedef {object} GetFilesCodeOptions
 * @property {string} dir glob路径
 * @property {string[]} files glob文件名称数组
 */
