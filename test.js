/*
 * @Author: 锦阳
 * @Create: 2021年05月13日
 */

const { spawn } = require('child_process');

const child = spawn('npm', ['run', 'test'], {
    // stdio: [process.stdin, process.stdout, process.stderr],
    // stdio: 'pipe',
    // stdio: ['inherit', 'inherit', 'inherit'],
});
child.stdin.pipe(process.stdin);
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
let res = '';
child.stdout.on('data', function (data) {
    /**
     * @type {string}
     */
    const output = data.toString();
    res += output;
    // if (/^All files/.test(output)) {
    //     const match = output.match(/^All\sfiles\s+\|\s+(?<stmts>\d+)\s+\|\s+(?<branch>\d+)\s+\|\s+(?<funcs>\d+)\s+\|\s+(?<lines>\d+)\s+\|/);
    //     setTimeout(() => {
    //         console.log(match.groups);
    //     }, 100);
    // }
});
child.stdout.on('close', function () {
    console.log('>>>>>>>');
    console.log(res.replace(/(-+\|?){6}([\w\s|%#]+(-+\|?){6}[\w\s|%#\d]+)(-+\|?){6}/, '$2'));
});
