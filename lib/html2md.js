//todo Add html to markdown from file or url.
var toMarkdown = require('to-markdown');
var fs = require('fs');

var content = fs.readFile('./frontend/basic/1-使用 Google Fonts 为网页添加美观字体.html', function(err, html) {
  if (err) throw err;
  var md = toMarkdown(html.toString());
  fs.writeFile('./frontend/basic/test.md', md, function(err) {
    if (err) throw err;
    console.log('It\'s saved!');
  })
});

