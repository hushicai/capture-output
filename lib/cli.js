var fs = require('fs');
var spawn = require('child_process').spawn;

var cli = {};

cli.capture = function(args) {
    if (args.length != 2) {
        console.log('用法示例：capture-output "command [args]"');
        phantom.exit();
        return -1;
    }

    var shell = args[1];

    shell = shell.split(' ');
    var command = shell.shift();
    var shellArgs = shell;

    var child = spawn(command, shellArgs, null);

    var output = [];
    child.stdout.on('data', function(data) {
        output.push(data);
    });
    child.stderr.on('data', function(e) {
        console.log(e);
    });

    // 输出路径
    var outputDir = system.env.HOME + '/capture-output';

    child.on('exit', function(code) {
        render();
    });

    function render() {
        var content = output.join('');
        // 保持换行格式
        content = content.replace(/(\r?\n)/g, '<br />$1');

        // capture-output的安装路径
        var baseDir = fs.absolute(system.env._ + '/../..');
        var template = fs.read(baseDir + '/resource/run.html');
        var temp = outputDir + '/run.html';
        fs.write(temp, template.replace(/\$\{content\}/, content));

        var page = require('webpage').create();
        page.viewportSize = {width: 1026, height: 768};
        var url = 'file://' + temp;
        page.open(url, function() {
            var png = outputDir + '/' + command + '-' + (+new Date) + '.png';
            page.render(png);
            console.log('图片已截至: ' + png);
            fs.remove(temp);
            phantom.exit();
        });
    }
};

module.exports = exports = cli;
