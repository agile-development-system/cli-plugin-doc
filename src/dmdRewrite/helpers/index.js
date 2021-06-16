/*
 * @Author: 锦阳
 * @Create: 2021年05月09日
 */
/**
 * returns a more appropriate 'kind', depending on context
 *
 * @param {object} options 参数
 * @returns {string}
 * @ignore
 */
exports.kindInThisContext = function kindInThisContext(options) {
    if (this.kind === 'function' && this.memberof) {
        return '方法';
    } else if (this.kind === 'member' && !this.isEnum && this.memberof) {
        return '属性';
    } else if (this.kind === 'member' && this.isEnum && this.memberof) {
        return '枚举属性';
    } else if (this.kind === 'member' && this.isEnum && !this.memberof) {
        return '枚举';
    } else if (this.kind === 'member' && this.scope === 'global') {
        return '变量';
    } else if (this.kind === 'typedef') {
        return '类型声明';
    } else if (this.kind === 'class' && this.scope === 'global') {
        return '类';
    } else if (this.kind === 'function' && this.scope === 'global') {
        return '函数';
    } else if (this.kind === 'constant' && this.scope === 'global') {
        return '常量';
    } else {
        return this.kind;
    }
};

exports.scopeInThisContext = function () {
    switch (this.scope) {
        case 'global':
            return '';
        case 'static':
            return '静态';
        case 'inner':
            return '内部';
        default:
            return this.scope;
    }
};
