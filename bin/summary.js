#! /usr/bin/env node

var _ = require("lodash");
var program = require("commander");

var pkg = require("../package.json");
var book = require("../lib/");
var convert = require("../lib/convert");

program
    .version(pkg.version)
    .option("-d, --debug", "enable verbose error");

program
    .command("summary <cmd>")
    .alias("sm")
    .description("generate a `SUMMARY.md` from a folder")
    .option("-r, --root", "root folder, default is `.`")
    .option("-n, --bookname", "book name, default is `Your Book Name`.")
    .option("-c, --catalog", "catalog folders included book files, default is `all`.")
    .option("-i, --ignores", "ignore folders that be excluded, default is `[]`.")
    .option("-u, --unchanged", "unchanged catalog like `request.js`, default is `[]`.")
    .option("-o, --outputfile", "output file, defaut is `./SUMMARY.md`")
    .action(function(cmd, options) {
        // The `generate` command
        if (_.isEqual(cmd, "g") || _.isEqual(cmd, "generate")) {
            book.summary(options);
        }

        // Convert TW to CN
        else if (_.isEqual(cmd, "c") || _.isEqual(cmd, "convert")) {
            convert.run(options);
        }
    });

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
    program.help();
}
