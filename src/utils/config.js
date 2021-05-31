const path = require('path');
const defaultTemplate = path.resolve(__dirname, '../template/template.ejs');
const renderCode = require('./renderCode');
const defaultConfig = {
    template: defaultTemplate,
    jsdoc2mdOptions: {
        // 'no-cache': true,
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
    helper: {
        renderCode,
    },
};

module.exports = defaultConfig;
