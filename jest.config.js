/*
 * @Author: 锦阳
 * @Create: 2021年05月13日
 */
const pkg = require('./package.json');
module.exports = {
    collectCoverage: true,
    testEnvironment: 'node',
    roots: [
        '<rootDir>/test',
    ],
    moduleNameMapper: {
        [`^${pkg.name}$`]: '<rootDir>/src/index.js',
    },
    testRegex: 'test/__test__/(.+)\\.(jsx?)$',
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!**/node_modules/**',
        '!**/helpers/**',
        '!**/test/**',
    ],
};
