var should = require('should');
var sort = require('../lib/files').sort;

describe('files.js', function () {
  var DirClass = function(name) {
    this.name = name;
    this.isDirectory = true;
  };

  it('test sort with alphabet', function () {
    var order = [new DirClass('01-a'), new DirClass('02-a'), new DirClass('03a-a'), new DirClass('03-a'), new DirClass('04-a')];
    var sorted = order.sort(function(current, next) {
      return sort(current, next, '-');
    });

    should.deepEqual(sorted,
      [new DirClass('01-a'), new DirClass('02-a'), new DirClass('03-a'), new DirClass('03a-a'), new DirClass('04-a')]);
  });

  it('test sort only digit', function () {
    var order = [new DirClass('01-a'), new DirClass('2-a'), new DirClass('7-a'), new DirClass('10-a'), new DirClass('04-a')];
    var sorted = order.sort(function(current, next) {
      return sort(current, next, '-');
    });

    should.deepEqual(sorted,
      [new DirClass('01-a'), new DirClass('2-a'), new DirClass('04-a'), new DirClass('7-a'), new DirClass('10-a')]);
  });
});
