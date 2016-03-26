var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var async = require('async');

// Use a loop to read all files
function getFilesJson(root, filesJson, next) {

    fs.readdir(root, function(err, files) {
        if (err) {
            return next(err)
        };
        files.forEach(walk);
    })

    function walk(file) {
        var newpath = path.join(root, file);

        fs.stat(newpath, function(err, state) {
            if (err) {
                return next(err);
            }

            if (state.isDirectory()) {
                filesJson[file] = {};
                getFilesJson(newpath, filesJson[file], next);
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
            next(null, filesJson)
        });
    }
}

module.exports = getFilesJson;
