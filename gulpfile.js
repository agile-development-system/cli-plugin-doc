/*
 * @Author: 锦阳
 * @Create: 2021年04月12日
 */
const { series, src, dest, parallel } = require('gulp');
const rimraf = require('rimraf');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const merge = require('merge2');

/**
 * 清除构建目录
 *
 * @returns {Promise}
 */
function clean() {
    return new Promise((resolve) => rimraf('lib', resolve));
}
/**
 * 构建
 *
 * @returns {import('node:stream').Stream}
 */
function build() {
    const tsResult = src('src/**/*.[tj]s')
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(dest('lib/types')),
        tsResult.js.pipe(babel()).pipe(dest('lib')),
    ]);
}

/**
 * 复制无法构建的文件
 *
 * @returns {import('node:stream').Stream}
 */
function cp() {
    return src('src/**/*.!([tj]s)').pipe(dest('lib'));
}

exports.default = series(clean, parallel(build, cp));
