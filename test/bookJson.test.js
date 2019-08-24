var fs = require('fs-extra');
var path = require('path');
var should = require('should');

var config = require('../lib/bookJson');

describe('config.js', function () {
	it('should get book.title if `book.json` exists', function () {
		should(config('test/books/config-json').title).be.equal('json-config-name');
	});
});
