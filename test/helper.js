var path = require('path');
var _ = require('lodash');

// Generate and return a book
function getBook(root, test, opts) {
    console.log("hello");
}

global.books = {
    generate: getBook
};

// Cleanup all tests
after(function() {
    books.generate();
    console.log("world");
});
