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

    var tempFile = './temp/' + (+new Date);
    child.on('exit', function(code) {
        fs.write(tempFile, output.join(''));
        render();
    });

    function render() {
        var content = fs.read(tempFile);
        content = content.replace(/(\r?\n)/g, '<br />$1');
        fs.remove(tempFile);

        var template = fs.read('./resource/run.html');
        var temp = './resource/temp.html';
        fs.write(temp, template.replace(/\$\{content\}/, content));

        var url = 'file://' + fs.absolute(temp);
        var page = require('webpage').create();
        page.viewportSize = {width: 1026, height: 768};
        page.open(url, function() {
            page.render('./output/' + command + '-' + (+new Date) + '.png');
            fs.remove(temp);
            phantom.exit();
        });
    }
};

module.exports = exports = cli;
