/*
 * @Author: 锦阳
 * @Create: 2021年04月12日
 */
const { series, src, dest } = require('gulp');
const rimraf = require('rimraf');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const merge = require('merge2');
/**
 * @param {()=>{}} cb 回调
 */
function clean(cb) {
    rimraf('lib', cb);
}
/**
 * @param {()=>{}} cb 回调
 */
function build(cb) {
    const tsResult = src('src/**/*.[tj]s')
        .pipe(tsProject());

    merge([
        tsResult.dts.pipe(dest('lib/types')),
        tsResult.js.pipe(babel()).pipe(dest('lib')),
    ]);
    cb();
}

/**
 * @param {()=>{}} cb 回调
 */
function cp(cb) {
    src('src/**/*.!([tj]s)').pipe(dest('lib'));
    cb();
}

const doit = series(clean, build, cp);
doit();
exports.default = doit;
