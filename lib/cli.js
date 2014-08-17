var path = require('path');
var spawn = require('child_process').spawn;

var webshot = require('webshot');

var util = require('./util');

var cli = {};

cli.capture = function(args) {
    if (args.length != 3) {
        console.log('用法示例：capture-output "command [args]"');
        return -1;
    }

    console.log('截图中...');

    var shell = args[2].split(' ');
    var command = shell.shift();
    var shellArgs = shell;

    var child;

    try {
        child = spawn(command, shellArgs, null);
    }
    catch (ex) {
        console.log(ex);
    }

    if (!child) {
        console.log('无法执行命令，请确认`' + command + '`存在于环境变量中。');
        return;
    }

    var output = [];
    var err = [];

    child.stdout.on('data', function(data) {
        output.push(data);
    });
    child.stderr.on('data', function(e) {
        err.push(e);
    });
    child.on('exit', function(code) {
        render(code);
    });

    // 输出路径
    var outputDir = process.env.HOME + '/capture-output';

    if (process.env.OUTPUT) {
        outputDir = process.env.OUTPUT;
    }

    function render(code) {
        var content = code === 0 ? output.join('') : err.join('');

        // 保持换行格式
        content = content.replace(/(\r?\n)/g, '<br />$1');

        util.log(content);

        // 图片地址
        var png = path.resolve(outputDir, path.basename(command)) + '.png';

        // 截图
        webshot(
            '<html><head></head><body>' +content+ '</body></html>',
            png,
            {
                siteType: 'html',
                windowSize: {
                    width: 1024,
                    height: 768
                },
                shotSize: {
                    width: 'all',
                    height: 'all'
                },
                customCSS: 'body{background: #fff; color: #333; font-family: simsun;}',
                streamType: 'png'
            },
            function(e) {
                console.log('图片已截至：' + png);
            }
        );
        return code;
    }
};

module.exports = exports = cli;
