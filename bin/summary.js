#! /usr/bin/env node

var _ = require("lodash");
var program = require("commander");
var color = require('bash-color');

var pkg = require("../package.json");
var book = require("../lib/");
var convert = require("../lib/convert");

program
    .version(pkg.version)
    .option("-d, --debug", "enable verbose error")
    .option("-r, --root [root]", "root folder, default is `.`")
    .option("-n, --bookname [bookname]", "book name, default is `Your Book Name`.")
    .option("-c, --catalog [catalog]", "catalog folders included book files, default is `all`.")
    .option("-i, --ignores [ignores]", "ignore folders that be excluded, default is `[]`.")
    .option("-u, --unchanged [unchanged]", "unchanged catalog like `request.js`, default is `[]`.")
    .option("-o, --outputfile [outputfile]", "output file, defaut is `./SUMMARY.md`");

program
    .command("summary [g]")
    .alias("sm")
    .description("generate a `SUMMARY.md` from a folder")
    .action(function(cmd) {
        // fixme
        // The `generate` command
        if (_.isEqual(cmd, "g") || _.isEqual(cmd, "generate")) {
            book.summary(program);
        } else {
            console.log(color.red("Error! Please add `g` or `generate` command, for example: `book sm g`."));
        }
    });

// Todo
// program
//     .command("convert")
//     .alias("c")
//     .action(function(cmd) {
//         var options = program;

//         // Convert TW to CN
//         if (_.isEqual(cmd, "c") || _.isEqual(cmd, "convert")) {
//             convert.run(options);
//         }
//     });

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
    // console.log(process.argv)
    program.help();
}
