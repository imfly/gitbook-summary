var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var async = require('async');

// Use a loop to read all files
function getFilesJson(root, filesJson, cb) {

    // async.waterfall([
    //     function(next) {
    //         fs.readdir(root, next);
    //     },

    //     function(files, next) {
    //         files.forEach(walk);
    //         next(null, filesJson)
    //     }
    // ], function(err, result) {
    //     if (err) {
    //         return cb(err)
    //     };
    //     console.log("result = ", result);
    //     cb(null, result);
    // });

    fs.readdir(root, function(err, files) {
        if (err) {
            return cb(err)
        };
        files.forEach(walk);
    })

    function walk(file) {
        var newpath = path.join(root, file);

        fs.stat(newpath, function(err, state) {
            if (err) {
                return cb(err);
            }

            if (state.isDirectory()) {
                filesJson[file] = {};
                getFilesJson(newpath, filesJson[file], cb);
            }

            // Parse the file.
            var obj = path.parse(newpath);

            // Delete `root ` from the  dir.
            var dir = _.trim(obj.dir, root);

            //  Only get markdown files.
            if (obj.ext === '.md') {
                filesJson[obj.name] = dir + '/' + obj.base + ')\n';
            }
            // console.log(filesJson);
            cb(null, filesJson)
        });
    }
}

module.exports = getFilesJson;
