var Q = require("q");
var _ = require("lodash");
var color = require('bash-color');
var fs = require('fs');
var pathd = require('path');

var pkg = require("../package.json");

/**
 * 根据文件夹和文件名称转化为目录
 * @param path 路径
 */
function geFileList(path) {
    var filesList = {};
    filesList[path] = {};
    readFile(path, filesList[path]);
    return filesList;
}

// 遍历读取文件
function readFile(path, filesList) {
    //同步读取
    files = fs.readdirSync(path);
    files.forEach(walk);
    function walk(file) {
        var newpath = path + '/' + file;
        var state = fs.statSync(newpath);

        if (state.isDirectory()) {
            filesList[file] = {};
            readFile(newpath, filesList[file]);
        }
        else {
            //创建一个对象保存信息
            var obj = pathd.parse(newpath);
            //文件大小，以字节为单位
            //obj.size = state.size;
            var dir = _.drop(obj.dir.split("/"), 1).join("/"); 
            // 
            filesList[obj.name] = "* [" + _.startCase(obj.name) + "](" + dir + "/" + obj.base + ")\n";
        }
    }
}

// 写入utf-8格式文件
function writeFile(fileName, data) {
    fs.writeFile(fileName, data, 'utf-8', function () {
        console.log(color.red("Finished, you can find SUMMARY.md in the folder."));
    })
}

// 转化为目录
function summary() {
    var filesList = geFileList("en");
    var str = "# " + pkg.description + "\n\n";
    var desc = "";
    var step = 0;

    work(filesList['en']);
    function work(fileObjects) {  
        _.forEach(fileObjects, function (n, key) {
            if (_.isObject(n)) {            
                desc += _.repeat(' ', step) + "- " + key + "\n"; 
                step += 2;           
                work(n); 
                step -= 2;                         
            } 
            else {
                desc += _.repeat(' ', step + 2) + n;                         
            } 
        }); 
               
    }

    str += desc;
    return writeFile("en/test.md", str);
}

module.exports = {
    summary: summary
};