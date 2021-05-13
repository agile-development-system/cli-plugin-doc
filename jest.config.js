/*
 * @Author: 锦阳
 * @Create: 2021年05月13日
 */
module.exports = {
    collectCoverage: true,
    testEnvironment: 'node',
    roots: [
        '<rootDir>/test',
    ],
    moduleNameMapper: {
        '^@ads/cli-plugin-doc$': '<rootDir>/src/index.js',
    },
    testRegex: 'test/__test__/(.+)\\.(jsx?)$',
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    collectCoverageFrom: [
        '**/*.{js,jsx}',
        '!**/node_modules/**',
        '!**/helpers/**',
        '!**/test/**',
    ],
};
