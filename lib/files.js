var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var color = require('bash-color');
var fm = require('front-matter');

// separate for test
var sort = function(current, next, sortedBy) {
  if (current.isDirectory && !next.isDirectory) return -1;
  if (!current.isDirectory && next.isDirectory) return 1;
  // Sorted if given current sorted hyphen, for example: `-` or `_`
  if (sortedBy) {
    var pattern = "(^\\d*)" + sortedBy;
    var reg = new RegExp(pattern);
    if(current.name.match(reg) && next.name.match(reg)){
      var currentNum = current.name.match(reg)[1];
      var nextNum = next.name.match(reg)[1];
      return currentNum - nextNum;
    }
  }
  return current.name.localeCompare(next.name);
};

// Use a loop to read all files
function ReadFile(filePath, filesJson, sortedBy) {
  var files;

  function getFrontMatterTitle(newpath)
  {
    // default to use filename
    var title = path.parse(newpath).name;
    var content = fs.readFileSync(newpath,'utf8');

    if (!fm.test(content)) return title;  // skip if no front matter

    var frontMatter = fm(content);
    if (typeof frontMatter.attributes.title === "undefined") return title;      // skip if no 'title' attributes
    // todo: set 'title' via config

    return frontMatter.attributes.title;
  }

  function walk(file) {
    var newpath = path.posix.join(filePath, file);
    var state = fs.statSync(newpath);

    if (state.isDirectory()) {
      filesJson[file] = {};
      new ReadFile(newpath, filesJson[file], sortedBy);
      // filter empty directories
      if (Object.keys(filesJson[file]).length < 1) {
        delete filesJson[file];
      }
    } else {
      // Parse the file.
      var obj = path.parse(newpath);

      if (obj.ext === '.md') {
        filesJson[getFrontMatterTitle(newpath)] = newpath + ")\n";
      }
    }
  }

  try {
    // Synchronous readdir
    files = fs.readdirSync(filePath)
      // sort the files: directories first, afterwards files
      .map(function(v) {
        var stat = fs.statSync(path.resolve(filePath, v));
        return {
          name: v,
          isDirectory: stat.isDirectory()
        };
      })
      .sort(function(current, next) {
        return sort(current, next, sortedBy);
      })
      .map(function(v) {
        return v.name;
      });

    files.forEach(walk);
  } catch (error) {
    filesJson = null; //fixme
    console.log(color.red(error.message));
  }
}

module.exports = {
  readFile: ReadFile,
  sort: sort
};
