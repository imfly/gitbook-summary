#! /usr/bin/env node

var _ = require("lodash");
var program = require("commander");
var color = require('bash-color');

var pkg = require("../package.json");
var book = require("../lib/");
var convert = require("../lib/convert");

function list(val) {
  return val.split(',');
}

program
    .version(pkg.version)
    .option("-r, --root [root]", "root folder, default is `.`")
    .option("-n, --bookname [bookname]", "book name, default is `Your Book Name`.")
    .option("-c, --catalog [catalog]", "catalog folders included book files, default is `all`.")
    .option("-i, --ignores [ignores]", "ignore folders that be excluded, default is `[]`.", list)
    .option("-u, --unchanged [unchanged]", "unchanged catalog like `request.js`, default is `[]`.")
    .option("-o, --outputfile [outputfile]", "output file, defaut is `./SUMMARY.md`");

program
    .command("summary [cmd...]")
    .alias("sm")
    .description("Generate a `SUMMARY.md` from a folder")
    .action(function(cmd) {
        // generate `SUMMARY.md`
        if (cmd.length >= 1) {
          console.log(color.red('\nError! The sub commands "%s" has been deprecated, please read the follow messages:'), cmd)
          program.help();
        }else{
          book.summary(program.opts());
        }
    });

// todo
program
    .command("convert")
    .alias("cv")
    .description("Todo: Convert articals between Simplified and Traditional Chinese.")
    .action(function() {
        // Convert TW to CN
        convert.run(program.opts());
    });

program
    .command('*')
    .description('Show error message.')
    .action(function(env) {
      console.log(color.red('\nError! Has no command "%s", please read the follow messages: '), env);
      program.help();
    });

// 没有参数时，直接显示帮助 Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
    program.help();
}
