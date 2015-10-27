var Q = require("q");
var _ = require("lodash");
var color = require('bash-color');
var fs = require('fs');
var pathd = require('path');

var pkg = require("../package.json");

/**
 * Get a summary from a fold such as `en`
 * @param path Path 
 */

 // Give two variables
var fromFolder = "en";
var outputFile = "en/test.md";

function geFileList(path) {
    var filesList = {};
    filesList[path] = {};
    readFile(path, filesList[path]);
    return filesList;
}

// Use a loop to read all files
function readFile(path, filesList) {
    //同步读取
    files = fs.readdirSync(path);
    files.forEach(walk);
    function walk(file) {
        var newpath = path + '/' + file;
        var state = fs.statSync(newpath);

        if (state.isDirectory()) {
            filesList[file] = {};
            readFile(newpath, filesList[file]);
        }
        else {
            // Parse the file.
            var obj = pathd.parse(newpath);
            // Get size of the file with `kb`.
            //obj.size = state.size;

            // Delete `en/` from the  dir.
            var dir = _.drop(obj.dir.split("/"), 1).join("/"); 

            //  Only get markdown files.
            if (obj.ext === '.md') { 
                filesList[obj.name] = "* [" + formatName(obj.name) + "](" + dir + "/" + obj.base + ")\n";
            }
        }
    }
}

// Don`t format the files like `req.options.*` using dot.
function formatName(name){
    var result = '';
    if (_.size(name.split(".")) > 1) {
        // console.log(name);
        result = name;
    }else{
        // console.log(name);
        result = _.startCase(name);
    };
    return result;
}

// Write to file  encoded with utf-8
function writeFile(fileName,  data) {
    fs.writeFile(fileName, data, 'utf-8', function () {
        console.log(color.red("Finished, you can find SUMMARY.md in the folder."));
    })
}

// Get summary 
function summary() {
    var filesList = geFileList(fromFolder);
    var str = "# " + pkg.description + "\n\n";
    var desc = "";
    var step = 0;

    work(filesList[fromFolder]);
    function work(fileObjects) {  
        _.forEach(fileObjects, function (n, key) {
            if (_.isObject(n)) {            
                desc += _.repeat(' ', step) + "- " + key + "\n"; 
                step += 2;           
                work(n); 
                step -= 2;                         
            } 
            else {
                desc += _.repeat(' ',  step + 2) + n;                         
            } 
        }); 
               
    }

    str += desc;
    return writeFile(outputFile,  str);
}

module.exports = {
    summary: summary
};