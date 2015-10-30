#! /usr/bin/env node
var Q = require("q");
var _ = require("lodash");
var program = require('commander');

var pkg = require("../package.json");
var book = require("../lib/");

function runPromise(p) {
    return p
        .then(function () {
            process.exit(0);
        }, function (err) {
            console.log("");
            console.log(color.red(err.toString()));
            if (program.debug || process.env.DEBUG) console.log(err.stack || "");
            process.exit(1);
        });
}

program
    .version(pkg.version)
    .option('-d, --debug', 'enable verbose error');

program
    .command('summary')
    .alias('sm')
    .description('generate a `SUMMARY.md` from a folder')
    .option("-r, --bookroot [optional]",  "root folder, default is `.`")
    .option("-n, --bookname [optional]", "book name, default is `Your Book Name`.")
    .option("-c, --bookcatalog [optional]", "catalog folders included book files, default is `all`.")
    .option("-i, --ignorefolders [optional]", "ignore folders that be excluded, default is `[]`.")
    .option("-u, --unchangedcatalog [optional]", "unchanged catalog like `request.js`, default is `[]`.")
    .option("-o, --outputfile [optional]",  "output file, defaut is `./SUMMARY.md`")    
    .action(function (options) {
        // console.log(options.bookroot);
        book.summary(options);
    });

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
    program.help();
}
