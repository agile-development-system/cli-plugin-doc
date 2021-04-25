/*
 * @Author: 锦阳
 * @Create: 2021年04月17日
 */
const FileSet = require('file-set');
const { FastPath } = require('@ads/node-utils');
/**
 * 基于glob的文件遍历函数
 * @param {object} files glob路径数组
 * @param {filesForEachCb<T>} cb 文件遍历回调
 * @returns {Promise<T[]>}
 * @template T
 */
function filesForEach(files, cb) {
    const fileSet = new FileSet(files);
    const _files = fileSet.files;
    if (!(_files && _files.length > 0)) {
        throw new Error('未匹配到任何文件，请确认输入路径');
    }
    return _files.map(file => cb(FastPath.getCwdPath(file)));
}

exports.filesForEach = filesForEach;

/**
 * filesForEach的回调函数
 * @callback filesForEachCb
 * @param {string} path 文件路径解析对象，具体内容请参照
 * [👉node:path.parse文档]{@link https://nodejs.org/dist/latest-v14.x/docs/api/path.html#path_path_parse_path}
 * @returns {T}
 * @template T
 */
