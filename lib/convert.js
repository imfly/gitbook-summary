var _ = require("lodash");
var color = require('bash-color');
var fs = require('fs');
var path = require('path');

var spawn = require('child_process').spawn,
    out = fs.openSync('out.log', 'a'),
    err = fs.openSync('out.log', 'a');

var convert = (function() {
    function convert() {}

    // Asynchronous process to handle files
    convert.handleFile = function(rootPath, configure) {
        try {
            var self = this;

            fs.readdir(rootPath, function(err, files) {
                if (err) {
                    console.log('read dir error');
                } else {
                    files.forEach(function(item) {
                        var tmpPath = rootPath + '/' + item;
                        fs.stat(tmpPath, function(err1, state) {
                            if (err1) {
                                console.log('stat error');
                            } else {
                                if (state.isDirectory()) {
                                    convert.handleFile(tmpPath, configure);
                                } else {
                                    // http://nodejs.cn/api/child_process.html#child_process_child_process_execfile_file_args_options_callback
                                    spawn('opencc', ['-i', tmpPath, '-o', tmpPath, '-c', configure], {
                                            // detached: true,
                                            stdio: ['ignore', fs.openSync('./out.log', 'a'), fs.openSync('./err.log', 'a')]
                                        })
                                        .unref();
                                }
                            }
                        });
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    // Todo: Add more configures like `s2t.json`, and so on.
    convert.run = function(options) {
        // book sm t
        // console.log(process.argv[1], process.argv[2], process.argv[3]);
        var bookRoot = options.bookroot || '.';
        convert.handleFile(bookRoot, 'zht2zhs.ini');
        console.log(color.red("Finished."));
        // if (process.argv[3] === "t2s") {
        // convert.handleFile(process.argv[2], 'zhs2zht.ini');
        // }
    };

    return convert;
})();

module.exports = {
    run: convert.run
};
