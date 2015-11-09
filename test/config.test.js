var fs = require('fs-extra');
var path = require('path');
var should = require('should');

var config = require('../lib/config');

describe('config.js', function () {
	it('should get book.bookname if `book.json` exists', function () {
		should(config.get('test/books/config-json').bookname).be.equal('json-config-name');
	});
});