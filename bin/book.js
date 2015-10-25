#! /usr/bin/env node
var Q = require("q");
var _ = require("lodash");
var program = require('commander');
var color = require('bash-color');

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
    .description('generate en summary from */0home/0home.md')
    .action(function () {
        //var _versions = versions.list();
        //runPromise(
            book.summary()
        //        .then(function (txt) {
        //            console.log('The summary is ' + txt);
        //        })
        //);
    });

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
    program.help();
}

console.log(color.red('Finished!'));
