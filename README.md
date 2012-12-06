fileutil
=====

目标
-------
简易的文件操作API

安装
-------
npm install fileutil

示例
-------

```javascript
var fu = require('fileutil');

//创建文件
fu.touch('/var/www/log/2012-12-6.log');

//创建文件夹
fu.mkdri('/usr/local/tmp/node-example');

//删除文件或文件夹
fu.delete('/var/www/tmp');

//是否存在
fu.exist(file); 

//复制文件或者文件夹里的所有文件到某个新目录
fu.copy(file, 'new-path'); 

//移动文件或者文件夹里的所有文件到某个新目录
fu.move(file, 'new-path'); 

//重命名
fu.rename(file, 'new-name');

//列出文件夹里的所有文件和文件夹
var files = fu.list(src);

//根据过滤参数，列出文件夹里的所有文件和文件夹
var files = fu.list(src, {
  excludeDirectory: true, //不包含文件夹
  excludeFile: false, //包含文件
  matchFunction: function(item){
    return item.name.match(reg);
  }
});

//回调的方式遍历文件
fu.each(src, function(item){
  console.log(item.filename); //文件名
  console.log(item.name); //路径
  console.log(item.directory); //是否是文件夹
});

//异步回调的方式遍历文件
fu.each(src, function(item){
  console.log(item);
}, {
  sync: false, //异步
  matchFunction: function(item){
    return item.name.match(reg);
  }
}, function(){
  console.log('遍历完成');
})


Licence
---------

`fileutil` is free to use under MIT license. 

Bugs & Feedback
----------

Please feel free to [report bugs](http://github.com/colorhook/fileutil/issues) or [feature requests](http://github.com/colorhook/fileutil/pulls).
You can send me private message on `github`, or send me an email to: [colorhook@gmail.com]