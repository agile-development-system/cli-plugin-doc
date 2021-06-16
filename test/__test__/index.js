const { expect, test } = require('@jest/globals');
const GenDoc = require('@agds/cli-plugin-doc');
const config = require('../__mock__/index');
const path = require('path');
test('GenDoc render', async () => {
    const res = await GenDoc.render(await config());
    expect(typeof res === 'string').toBe(true);
});

test('GenDoc render output & use agds.doc.config.js', async () => {
    const res = await GenDoc.render({
        output: path.resolve(__dirname, '../../.temp/README.md'),
    });
    expect(typeof res === 'undefined').toBe(true);
});

test('GenDoc render no files', async () => {
    const res = await GenDoc.render(await config({ noFiles: true }));
    expect(typeof res === 'string').toBe(true);
});

test('GenDoc render no codes', async () => {
    const res = await GenDoc.render(await config({ noCodes: true }));
    expect(typeof res === 'string').toBe(true);
});

test('GenDoc render error', async () => {
    try {
        await GenDoc.render(await config({ needDirError: true }));
    } catch (error) {
        expect(error.message).toMatch('未匹配到任何目录，请确认输入路径');
    }
});

test('GenDoc getRenderData nodefault', async () => {
    const res = await GenDoc.getRenderData(await config({ noDefault: true }));
    expect(typeof res === 'object').toBe(true);
});

test('GenDoc getRenderData', async () => {
    const res = await GenDoc.getRenderData(await config(), false);
    expect(typeof res === 'object').toBe(true);
});

test('GenDoc getFileContent', () => {
    const res = GenDoc.getFileContent('./README.md');
    expect(typeof res === 'string').toBe(true);
});
