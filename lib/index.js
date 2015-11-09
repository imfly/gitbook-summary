var _ = require("lodash");
var color = require('bash-color');
var fs = require('fs');
var path = require('path');

var config = require('./config');

/**
 * Get a summary from a fold such as `/path/to/your/book` or `../book`
 * @param root root
 */

// Todo: migrate to a object and can get from a book.json.
// Give some variables
var root,
    bookname, // don`t use `name`
    outputFile,
    catalog,
    ignores,
    unchanged,
    files;

// Get options
function init(options) {
    root = options.root || '.';

    var bookConfig = config.get(root);

    outputFile = options.outputfile || bookConfig.outputfile;

    catalog = options.catalog || bookConfig.catalog;
    ignores = options.ignores || bookConfig.ignores;
    unchanged = options.unchanged || bookConfig.unchanged;
    bookname = options.bookname || bookConfig.bookname;
}

// Get a files Object
function getAllFiles(root) {
    var result = {},
        filesJson = {};

    readFile(root, filesJson);
    
    result = _.pick(filesJson, filterRules);

    return result;
}

// Filter in the `catalog` and exclude in the `ignores`
function filterRules(n, key) {
    var result = null;

    //default to ignore `SUMMARY.md`
    ignores.push('SUMMARY');

    if (catalog === 'all') {
        result = !_.includes(ignores, key);
    } else {
        result = _.includes(catalog, key) && !_.includes(ignores, key);
    };
    return result; 
}

// Use a loop to read all files
function readFile(root, filesJson) {
    // Synchronous readdir
    files = fs.readdirSync(root);
    files.forEach(walk);

    function walk(file) {
        var newpath = root + '/' + file;
        var state = fs.statSync(newpath);

        if (state.isDirectory()) {
            filesJson[file] = {};
            readFile(newpath, filesJson[file]);
        } else {
            // Parse the file.
            var obj = path.parse(newpath);
            // Get size of the file with `kb`.
            //obj.size = state.size;

            // Delete `root` from the  dir.
            var dir = _.drop(obj.dir.split("/"), _.size(root.split("/"))).join("/");

            //  Only get markdown files.
            if (obj.ext === '.md') {
                filesJson[obj.name] = dir + "/" + obj.base + ")\n";
            }
        }
    }
}

// Don`t format the files like `req.options.*` using dot.
function formatName(bookname) {
    var result = '';

    if (_.size(bookname.split(".")) > 1 || _.includes(unchanged, bookname)) {
        result = bookname;
    } else {
        result = _.startCase(bookname);
    };
    return result;
}

// Sign is `-` when folder
function formatKey(folderName, sign) {
    sign = sign || '*';
    return sign + " [" + formatName(folderName) + "](";
}

function isSkiped(key, skip) {
    var result = !_.isEmpty(skip) && _.isEqual(key.toLowerCase(), skip.toLowerCase()) || _.isEqual(key.toLowerCase(), 'readme');
    return result;
}

// Write to file  encoded with utf-8
function writeFile(fileName, data) {
    fs.writeFile(fileName, data, 'utf-8', function() {
        console.log(color.red("Finished, you can find SUMMARY.md in your folder."));
    })
}

// Get summary
function summary(options) {
    var result = '',
        desc = '',
        step = 0,
        skip = null,
        filesObj;

    init(options);

    filesObj = getAllFiles(root);

    work(filesObj);

    function work(filesObj) {
        _.forEach(filesObj, function(n, key) {
            if (!_.includes(ignores, key)) {
                if (_.isObject(n)) {

                    // It means folderName == subFileName, for example: */assets/assets.md or */Assets/assets.md
                    if (_.isString(n[key]) || _.isString(n[key.toLowerCase()])) {
                        var file = n[key] || n[key.toLowerCase()];
                        desc += _.repeat(' ', step) + formatKey(key, '-') + file;

                        // Mark it to skip
                        skip = key;
                    } else

                    // The file is `readme.md`
                    if (_.isString(n['readme']) || _.isString(n['Readme']) || _.isString(n['README'])) {
                        var readmeDir = n['readme'] || n['Readme'] || n['README'];
                        desc += _.repeat(' ', step) + formatKey(key, '-') + readmeDir;
                    } else {
                        desc += _.repeat(' ', step) + "- " + formatName(key) + "\n";
                    };

                    // Start a loop
                    step += 2;
                    work(n);
                    step -= 2;
                } else {
                    // Skip if `skip` exists or key == `readme`
                    if (isSkiped(key, skip)) {
                        return;
                    };

                    desc += _.repeat(' ', step + 2) + formatKey(key) + n;
                }
            };
        });
    }


    bookname = "# " + bookname + "\n\n";
    result += bookname + desc;

    return writeFile(outputFile, result);
}

module.exports = {
    summary: summary
};