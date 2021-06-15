/*
 * @Author: 锦阳
 * @Create: 2021年05月13日
 */
const { PresetUtils } = require('@agds/node-utils');
module.exports = PresetUtils.getDeepPresetMergeAndModify({
    presets: [require('@agds/jest-config-node')()],
});
