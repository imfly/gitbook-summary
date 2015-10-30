var Q = require("q");
var _ = require("lodash");
var color = require('bash-color');
var fs = require('fs');
var path = require('path');

var pkg = require("../package.json");

/**
 * Get a summary from a fold such as `/path/to/your/book` or `../book`
 * @param root root 
 */

// Todo: migrate to a object and can get from a book.json.
// Give some variables
var bookRoot,
    outputFile,
    bookCatalog,
    ignoreFolders,
    unchangedCatalog,
    bookName,
    bookTitle;

// Get options
function init(options) {
    bookRoot = options.bookroot || '.';
    outputFile = options.outputfile || bookRoot + '/SUMMARY.md';

    bookCatalog = options.bookcatalog || 'all';
    ignoreFolders = options.ignorefolders || [];
    unchangedCatalog = options.unchangedcatalog || [];
    bookName = options.bookname || 'Your Book Name';

    bookTitle = "# " + bookName + "\n\n";
}

// Get filesObjects
function filterCatelogFiles(root) {
    var result = {};
    var filesObject = getAllFiles(root);

    if (bookCatalog === 'all') {
        result = filesObject[root]
    } else {
        result = _.pick(filesObject[root], filterRules);
    };

    return result;
}

function getAllFiles(root) {
    var filesObject = {};
    filesObject[root] = {};

    readFile(root, filesObject[root]);

    return filesObject;
}

// Filter in the `bookCatalog` and exclude in the `ignoreFolders`
function filterRules(n, key) {
    return _.includes(bookCatalog, key) && !_.includes(ignoreFolders, key);
}

// Use a loop to read all files
function readFile(root, filesObject) {
    // Synchronous readdir
    files = fs.readdirSync(root);
    files.forEach(walk);

    function walk(file) {
        var newpath = root + '/' + file;
        var state = fs.statSync(newpath);

        if (state.isDirectory()) {
            filesObject[file] = {};
            readFile(newpath, filesObject[file]);
        } else {
            // Parse the file.
            var obj = path.parse(newpath);
            // Get size of the file with `kb`.
            //obj.size = state.size;

            // Delete `bookRoot` from the  dir.
            var dir = _.drop(obj.dir.split("/"), _.size(bookRoot.split("/"))).join("/");

            //  Only get markdown files.
            if (obj.ext === '.md') {
                filesObject[obj.name] = dir + "/" + obj.base + ")\n";
            }
        }
    }
}

// Don`t format the files like `req.options.*` using dot.
function formatName(name) {
    var result = '';

    if (_.size(name.split(".")) > 1 || _.includes(unchangedCatalog, name)) {
        result = name;
    } else {
        result = _.startCase(name);
    };
    return result;
}

// Sign is `=` when folder
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
        -console.log(color.red("Finished, you can find SUMMARY.md in your folder."));
    })
}

// Get summary 
function summary(options) {
    init(options);
    var str = '';
    var desc = '';
    var step = 0;
    var skip = null;

    var filesObj = filterCatelogFiles(bookRoot);

    work(filesObj);

    function work(filesObj) {
        _.forEach(filesObj, function(n, key) {
            if (!_.includes(ignoreFolders, key)) {
                if (_.isObject(n)) {

                    // It means folderName == subFileName, for example: */assets/assets.md or */Assets/assets.md                   
                    if (_.isString(n[key]) || _.isString(n[key.toLowerCase()])) {
                        var file = n[key] || n[key.toLowerCase()];
                        desc += _.repeat(' ', step) + formatKey(key, '-') + file;

                        // Mark it to skip
                        skip = key;
                    }  else

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

    str += bookTitle + desc;
    return writeFile(outputFile, str);
}

module.exports = {
    summary: summary
};