# Gitbook Summary 

[![npm version](https://badge.fury.io/js/gitbook-summary.svg)](https://badge.fury.io/js/gitbook-summary)
[![Build Status](https://travis-ci.org/imfly/gitbook-summary.png?branch=master)](https://travis-ci.org/imfly/gitbook-summary)
[![Dependencies Status](https://david-dm.org/imfly/gitbook-summary.png)](https://david-dm.org/imfly/gitbook-summary)
[![Coverage Status](https://coveralls.io/repos/imfly/gitbook-summary/badge.png)](https://coveralls.io/r/imfly/gitbook-summary)


A command line tool to generate a `SUMMARY.MD` from a folder, such as "/en" or "/cn"。
	
## Features

- ~~Generate `SUMMARY.md` by using a CLI with some options~~ 
- ~~Setting with `book.json`~~
- ~~Link `README.md` to the parent directory~~
- ~~Only get '.md' files ~~
- ~~Order by alphabet or numbers~~
- Generate eBooks(html, pdf, etc) by extending `gitbook`;
- Publish to github pages, for example:  http://imfly.github.io/sails-docs
- Merge to one page like a blog.
- Auto aggregate ebooks to website.

## Install

```
npm install -g gitbook-summary
```

## CoC (Convention over Configuration) 

Source directory:

```
sources
├── 1-FirstChapter   // The first chapter，format: {orderNumber or alphabet}-{chapterName}.md
├────── 1-FirstDocument.md 
├────── 5-SecondDocument.md  // concentrating solely on the order, not the numbers.
├── 3-SecondChapter                     // Focus only on the order, not the numbers.
├────── 1-FirstDocumentOfSecondChapter.md 
├────── 2-SecondDocumentOfSecondChapter.md  
├── 7-ThirdChapter 
├── FourthChapter  // May have no order
├── README.md // In addition to readme.md, not to put other markdown documents 
└── book.json     // Set up the book 
```

## Using

1. Generate a `SUMMARY.md` Simply

```
$ cd /path/to/your/book/
$ book sm g
``` 

or, For example:

```
$ book sm g -r ../sailsjs-docs-gitbook/en -i 0home -u 'myApp' -c 'concepts, reference, userguides' -n "Sails.js 官方文档(中英合辑）"
```

2. Create a `book.json` in the book`s root folder

for example:

```
// test/books/config-json/book.json
{
    "bookname": "json-config-name",
    "outputfile": "test.md",
    "catalog": "all",  // or [chapter1，chapter2, ...]
    "ignores": [],  
    "unchanged": [] // for example: ['myApp'] -> `myApp` not `My App` 
}
```

then, you can do:

```
$ book sm g
```

You will get a `test.md` file:

![test.md.jpg](doc/img/test.md.jpg)

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

The MIT License

