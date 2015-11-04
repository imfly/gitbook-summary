var fs = require('fs-extra');
var path = require('path');

function getBookConfig(bookroot) {
    var file = path.resolve(bookroot, 'book.json');
    var book = {}, config = {};

    if (fs.existsSync(file)) {
        config = fs.readJsonSync(file);
    };

    book.outputfile = bookroot + config.outputfile || bookroot + '/SUMMARY.md';
    book.catalog = config.catalog || 'all';
    book.ignorefolders = config.ignorefolders || [];
    book.unchangedcatalog = config.unchangedcatalog || [];
    book.name = config.name || 'Your Book Name';

    return book;
}

module.exports = {
    get: getBookConfig
};