var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var async = require('async');
var color = require('bash-color');

// Use a loop to read all files
function ReadFile(filePath, filesJson) {
    var files;

    try {
        // Synchronous readdir
        files = fs.readdirSync(filePath)
          // sort the files: directories first, afterwards files
          .map(function(v) {
            var stat = fs.statSync(path.resolve(filePath, v));
            return {
              name: v,
              isDirectory: stat.isDirectory()
            };
          })
          .sort(function(a, b) {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return a.name.localeCompare(b.name);
          })
          .map(function(v) {
            return v.name;
          });

        files.forEach(walk);
    } catch (error) {
        filesJson = null; //fixme
        console.log(color.red(error.message));
    }

    function walk(file) {
        var newpath = path.join(filePath, file);
        if (typeof newpath !== 'undefined') {
            var state = fs.statSync(newpath);

            if (state.isDirectory()) {
                filesJson[file] = {};
                ReadFile(newpath, filesJson[file]);
                // filter empty directories
                if (Object.keys(filesJson[file]).length < 1) {
                    delete filesJson[file];
                }
            } else {
                // Parse the file.
                var obj = path.parse(newpath);

                // Fixme: can`t cache the root which changed follow newpath
                // Delete `root` from the  dir.
                // var dir = _.trim(obj.dir, filePath);

                //  Only get markdown files.
                // todo: get all kinds of files
                if (obj.ext === '.md') {
                    filesJson[obj.name] = newpath + ")\n";
                }
            }
        }
    }
}

module.exports = ReadFile;
