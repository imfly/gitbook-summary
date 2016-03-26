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
        files = fs.readdirSync(filePath);
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
