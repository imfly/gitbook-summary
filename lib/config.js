var fs = require('fs-extra');
var path = require('path');

function getBookConfig(root) {
    var configFile = path.resolve(root, 'book.json');
    var book = {},
        config = {};

    if (fs.existsSync(configFile)) {
        config = fs.readJsonSync(configFile);
    }

    var outputName = config.outputfile || 'SUMMARY.md';

    book.outputfile = path.join(root, outputName);
    book.catalog = config.catalog || 'all';
    book.ignores = config.ignores || [];
    book.unchanged = config.unchanged || [];
    book.bookname = config.bookname || 'Your Book Name';

    return book;
}

module.exports = {
    get: getBookConfig
};
