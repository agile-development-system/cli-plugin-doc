/*
 * @Author: 锦阳
 * @Create: 2021年05月13日
 */
const { PresetUtils } = require('./lib/index');
module.exports = PresetUtils.getDeepPresetMergeAndModify({
    presets: [require('@ads/jest-config-node')()],
});
