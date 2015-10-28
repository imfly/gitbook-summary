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

// Give some variables
var rootFolder = "en";
var outputFile = "en/test.md";

var catalogFolders = ['getting-started', 'concepts', 'userguides', 'reference']; //'all';
var ignoreFolders = ['0home'];
var unchangedCatalog = ['myApp'];
var bookName = pkg.description || "Your Book Name";

// Get filesObjects
function filterCatelogFiles(path) {
    var result = {};
    var filesObject = getAllFiles(path);

    if (catalogFolders === 'all') {
        result = filesObject[path]
    } else {
        result = _.pick(filesObject[path], filterRules);
    };

    return result;
}

function getAllFiles(path) {
    var filesObject = {};
    filesObject[path] = {};

    readFile(path, filesObject[path]);

    return filesObject;
}

// Filter in the `catalogFolders` and exclude in the `ignoreFolders`
function filterRules(n, key) {
    return _.includes(catalogFolders, key) && !_.includes(ignoreFolders, key);
}

// Use a loop to read all files
function readFile(path, filesObject) {
    //同步读取
    files = fs.readdirSync(path);
    files.forEach(walk);

    function walk(file) {
        var newpath = path + '/' + file;
        var state = fs.statSync(newpath);

        if (state.isDirectory()) {
            filesObject[file] = {};
            readFile(newpath, filesObject[file]);
        } else {
            // Parse the file.
            var obj = pathd.parse(newpath);
            // Get size of the file with `kb`.
            //obj.size = state.size;

            // Delete `en/` from the  dir.
            var dir = _.drop(obj.dir.split("/"), 1).join("/");

            //  Only get markdown files.
            if (obj.ext === '.md') {
                filesObject[obj.name] = "* [" + formatName(obj.name) + "](" + dir + "/" + obj.base + ")\n";
            }
        }
    }
}

// Don`t format the files like `req.options.*` using dot.
function formatName(name) {
    var result = '';

    if (_.size(name.split(".")) > 1 || _.includes(unchangedCatalog, name)) {
        // console.log(name);
        result = name;
    } else {
        // console.log(name);
        result = _.startCase(name);
    };
    return result;
}

// Write to file  encoded with utf-8
function writeFile(fileName, data) {
    fs.writeFile(fileName, data, 'utf-8', function() {
        console.log(color.red("Finished, you can find SUMMARY.md in the folder."));
    })
}

// Get summary 
function summary() {
    var str = "# " + bookName + "\n\n";
    var desc = '';
    var step = 0;
    var skip = null;

    var filesObj = filterCatelogFiles(rootFolder);

    work(filesObj);

    function work(filesObj) {
        _.forEach(filesObj, function(n, key) {
            if (!_.includes(ignoreFolders, key)) {
                if (_.isObject(n)) {
                    if (_.isString(n[key])) {
                        desc += _.repeat(' ', step) + n[key];

                        // Mark it to skip
                        skip = key;
                    } else {
                        desc += _.repeat(' ', step) + "- " + formatName(key) + "\n";
                    };

                    // Start a loop
                    step += 2;
                    work(n);
                    step -= 2;
                } else {
                    // Skip
                    if (!_.isEmpty(skip) && _.isEqual(skip, key)) {
                        return;
                    };

                    desc += _.repeat(' ', step + 2) + n;
                }
            };
        });
    }

    str += desc;
    return writeFile(outputFile, str);
}

module.exports = {
    summary: summary
};