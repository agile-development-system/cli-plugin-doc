/*
 * @Author: 锦阳
 * @Create: 2021年05月16日
 */
const { Command } = require('commander');
const path = require('path');
const { Notice } = require('@ads/node-utils');
/**
 * 基于`commander.js`封装的命令行解析工具库
 */
class CmdParser {
    /**
     * 基于config配置Command实例
     *
     * @param {Command} program command实例
     * @param {CmdConfig} config 命令行解析配置
     */
    static optionParseByConfig(program, config) {
        config?.opts?.forEach(opt => {
            const optConfig = [opt.opt, opt.desc, opt.default];
            program[opt.required ? 'requiredOption' : 'option'].apply(program, optConfig);
        });
    }

    /**
     * 基于配置文件的命令行解析器
     *
     * @param {object} options 函数参数
     * @param {string} options.root 当前命令行npm包根目录
     * @param {boolean} [options.isCore] 是否是@ads/cli调用
     * @param {string} [options.cmd] 命令名称，命令调用必填
     */
    static cmdParser({ root, isCore, cmd }) {
        const program = new Command();
        const pkg = require(path.resolve(root, 'package.json'));
        /**
         * @type {CmdConfig[]}
         */
        let config = require(path.resolve(root, pkg?.ads?.config || 'ads.cli.config.js'));
        if (!Array.isArray(config)) {
            config = [config];
        }
        if (pkg) {
            program.description(pkg.description);
        }
        // 暂时没有开发@ads/cli的计划
        // if (isCore) {
        //     config.forEach(conf => {
        //         if (!conf.cmd) {
        //             throw new Error('插件配置错误，作为ads命令行插件使用时命令行配置项必须配置`cmd`');
        //         }
        //         const cmd = conf.cmd ? program.command(conf.cmd) : program;
        //         cmd.alias(conf.alias);
        //         cmd.description(conf.desc);
        //         this.optionParseByConfig(cmd, conf);
        //         cmd.action(plugin[conf.cmd]);
        //     });
        // } else {
        const conf = config.find(_conf => _conf.cmd === cmd);
        program.description(config.desc);
        this.optionParseByConfig(program, conf);
        program.action(async function name() {
            try {
                await conf.action.apply(conf, arguments);
            } catch (error) {
                Notice.error(error.stack);
                process.exit(1);
            }
        });

        if (conf.help) {
            Object.keys(conf.help).forEach(key => program.addHelpText(key, '\n' + conf.help[key].join('\n') + '\n'));
        }
        // }
        program
            .helpOption('-h, --help', '查看帮助信息');
        if (pkg) {
            program.version(pkg.version, '-v,--version', '查看版本号');
            program.addHelpText('after');
            pkg.repository && program.addHelpText('after', Notice.getBoldStr('info', '文档查看：') + pkg.repository.url.replace('.git', ''));
            program.addHelpText('after', pkg.name + '@' + pkg.version + ' ' + root);
        }
        program.parse(process.argv);
    }
}

module.exports = CmdParser;

/**
 *  `commander.js`实例
 *
 * @typedef {import('commander').Command} Command
 */

/**
 * @typedef {object} CmdConfig 命令行解析配置
 * @property {string} cmd 作为插件时为子命令名称，单独使用时`ads-<cmd>`为命令行程序名称
 * @property {string} desc 描述
 * @property {string} alias 此命令的别名，只在插件调用时有效
 * @property {OptConfig[]} opts option配置项描述
 */

/**
 * @typedef {object} OptConfig 命令行option解析配置
 * @property {string} opt option字段配置
 * @property {string} desc 描述
 * @property {string|boolean} default  默认值
 * @property {boolean} required 是否是必填参数
 */
