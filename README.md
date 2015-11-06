# Gitbook Summary 

[![npm version](https://badge.fury.io/js/gitbook-summary.svg)](https://badge.fury.io/js/gitbook-summary)
[![Build Status](https://travis-ci.org/imfly/gitbook-summary.png?branch=master)](https://travis-ci.org/imfly/gitbook-summary)
[![Dependencies Status](https://david-dm.org/imfly/gitbook-summary.png)](https://david-dm.org/imfly/gitbook-summary)
[![Coverage Status](https://coveralls.io/repos/imfly/gitbook-summary/badge.png)](https://coveralls.io/r/imfly/gitbook-summary)


A command line tool to generate a `SUMMARY.MD` from a folder, such as "/en" or "/cn"。
	
## Install

```
npm install -g gitbook-summary
```

## Using

Generate a `SUMMARY.md`

```
$ cd /path/to/your/book/
$ book sm g
``` 

For example:

```
book sm g -r ../sailsjs-docs-gitbook/en -i 0home -u 'myApp' -c 'concepts, reference, userguides' -n "Sails.js 官方文档(中英合辑）"
```

or, you can create a `book.json` in the book`s root folder, for example:

```
// test/books/config-json/book.json
{
    "name": "json-config-name",
    "outputfile": "test.md",
    "catalog": "all",
    "ignorefolders": [],
    "unchangedcatalog": []
}
```

then, you can do:

```
$ book sm g
```

You will get a `test.md` file:

![test.md.jpg](img/test.md.jpg)

## eBooks

Sails Docs Gitbook : https://imfly.gitbooks.io/sailsjs-docs-gitbook/

The Sources : https://github.com/imfly/sailsjs-docs-gitbook

## Development

```
npm install
npm link
```

## Test

```
npm test
```

## Contribute

We love pull requests! You can `fork it` and commit a `pr`

## License

Whatever you do, please indicate the source.

