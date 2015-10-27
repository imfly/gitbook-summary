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
    .option('-v, --gitbook [version]', 'specify GitBook version to use')
    .option('-d, --debug', 'enable verbose error');

program
    .command('summary')
    .description('generate en summary from the folder "en"')
    .action(function () {
        book.summary();
    });

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
    program.help();
}
