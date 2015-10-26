var Q = require("q");
var _ = require("lodash");
var fs = require('fs');
var pathd = require('path');

var pkg = require("../package.json");

/**
 * 遍历文件夹，获取所有文件夹里面的文件信息
 * @param path 路径
 */

function geFileList(path) {
    var filesList = {};
    readFile(path, filesList);
    return filesList;
}

//遍历读取文件
function readFile(path, filesList) {
    files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);
    function walk(file) {
        var newpath = path + '/' + file;
        var state = fs.statSync(newpath);

        if (state.isDirectory()) {
            filesList[path] = {};
            readFile(newpath, filesList[path]);
        }
        else {
            //创建一个对象保存信息
            var obj = pathd.parse(newpath);
            //obj.size = state.size;//文件大小，以字节为单位
            filesList[obj.name] = "* [" + obj.name + "](" + obj.dir + "/" + obj.base + ")";
        }
    }
}

//写入文件utf-8格式
function writeFile(fileName, data) {
    //return Q()
    //    .then(function () {
    //        fs.writeFile(fileName, data, 'utf-8', function(){
    //            console.log("ok");
    //        })
    //    });

    fs.writeFile(fileName, data, 'utf-8', function () {
        console.log("ok");
    })
}

var filesList = geFileList("en");
var str = "# " + _.startCase(pkg.name) + "\n\n";

function summaried(files) {
    var desc = "- ";
    _.forEach(files, function (n, key) {
        console.log(files);

        if (_.isObject(n)) {
            desc += key + "\n";

            summaried(n);
        } else {
            desc = "- [" + key + "]("
                + n.dir + "/"
                + n.base + ")"
                + "\n";

            str += desc;
        }
    });
}

function summary() {
    //for (var i = 0; i < filesList.length; i++) {
    //    var item = filesList[i];
    //
    //    //var itempath = item.dir.split(pathd.sep);
    //    //itempath.shift();
    //
    //    var desc = "- [" + item.name + "]("
    //        + item.dir + "/"
    //        + item.base + ")";
    //
    //    str += desc + "\n"
    //}

    summaried(filesList);
    return writeFile("en/test.md", str);
}

module.exports = {
    summary: summary
};