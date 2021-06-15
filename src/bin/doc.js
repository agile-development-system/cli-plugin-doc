#! /usr/bin/env node
/*
 * @Author: 锦阳
 * @Create: 2021年05月17日
 */
const path = require('path');
const CmdParser = require('@agds/node-utils').CmdParser;
CmdParser.cmdParser({ root: path.resolve(__dirname, '../../'), cmd: 'doc' });
