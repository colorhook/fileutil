var fu = require('../lib/fileutil');
var fs = require('fs');
var path = require('path');

describe('file is a static utility', function(){
  
  afterEach(function(){
    fu.delete('tmp');
    fu.delete('tmp2');
  });

  it('absolute method to an absolute path', function(){
    var f = __filename;
    fu.absolute(f).should.equal(path.resolve(f)); 
    fu.absolute(f, __dirname + '/../').should.equal(path.resolve(f));
  });

  it('exist method return if a file or dir exist', function(){
    var f = __filename;
    fu.exist(f).should.be.true;
    f = 'not-exist-file';
    fu.exist(f).should.be.false;
  });
 
  it('isFile method check file if is a file', function(){
    fu.isFile(__filename).should.be.true;
    fu.isFile(__dirname).should.be.false;
  });

  it('isDirectory method check file if is a directory', function(){
    fu.isDirectory(__filename).should.be.false;
    fu.isDirectory(__dirname).should.be.true;
  });

  it('extname method return the extend name', function(){
    fu.extname('a').should.equal('');
    fu.extname('a.js').should.equal('js');
    fu.extname('a.js', true).should.equal('.js');
    fu.extname('a.js.jpg').should.equal('jpg');
  });
 
  it('touch, mkdir, delete methods', function(){
    fu.exist('tmp').should.be.false;
    fu.mkdir('tmp');
    fu.exist('tmp').should.be.true;
    fu.mkdir(['tmp/a','tmp/b']);
    fu.touch('tmp/a/a.js');
    fu.exist('tmp/a/a.js').should.be.true;
    fu.delete('tmp');
    fu.exist('tmp').should.be.false;
    fu.exist('tmp/a/a.js').should.be.false;
  });


  it('read, write, append methods', function(){
    fu.touch('tmp');
    fu.exist('tmp').should.be.true;
    fu.read('tmp').should.equal('');

    fu.write('tmp', 'hello');
    fu.read('tmp').should.equal('hello');
    fu.append('tmp', ', fileutil');
    fu.read('tmp').should.equal('hello, fileutil');
    fu.delete('tmp');
  });

  it('rename method', function(){
    fu.touch('tmp');
    fu.exist('tmp').should.be.true;
    fu.rename('tmp', 'tmp2');
    fu.exist('tmp').should.be.false;
    fu.exist('tmp2').should.be.true;
    fu.exist('tmp2/tmp').should.be.false;
    fu.rename('tmp2', 'tmp/tmp2');
    fu.exist('tmp2').should.be.false;
    fu.exist('tmp').should.be.true;
    fu.exist('tmp/tmp2').should.be.true;
    fu.delete('tmp');
  });

  it('move method move file', function(){
    fu.touch('tmp');
    fu.exist('tmp').should.be.true;
    fu.move('tmp', 'tmp2');
    fu.exist('tmp').should.be.false;
    fu.exist('tmp2').should.be.true;
    fu.exist('tmp2').should.be.true;
    fu.delete('tmp2');
  });

  it('move method move dir', function(){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    fu.exist('tmp/a/b.js').should.be.true;
    fu.move('tmp', 'tmp2');
    fu.exist('tmp').should.be.false;
    fu.exist('tmp2').should.be.true;
    fu.exist('tmp2/a/b.js').should.be.true;
    fu.exist('tmp2/c/d.css').should.be.true;
    fu.delete('tmp2');
  });

  it('move with filter', function(){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    fu.mkdir('tmp/e');
    fu.move('tmp', 'tmp2', /\.js$/i);
    fu.exist('tmp2/a/b.js').should.be.true;
    fu.exist('tmp2/c').should.be.true;
    fu.exist('tmp2/c/d.css').should.be.false;
    fu.exist('tmp2/e').should.be.true;
  });

  it('copy method copy file', function(){
    fu.touch('tmp');
    fu.exist('tmp').should.be.true;
    fu.copy('tmp', 'tmp2');
    fu.exist('tmp').should.be.true;
    fu.exist('tmp2').should.be.true;
    fu.exist('tmp2/tmp').should.be.true;
  });

  it('copy method copy dir', function(){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    fu.copy('tmp', 'tmp2');
    fu.exist('tmp/a/b.js').should.be.true;
    fu.exist('tmp/c/d.css').should.be.true;
    fu.exist('tmp2/a/b.js').should.be.true;
    fu.exist('tmp2/c/d.css').should.be.true;
  });

  it('copy with filter', function(){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    fu.copy('tmp', 'tmp2', /\.js$/i);
    fu.exist('tmp2/a/b.js').should.be.true;
    fu.exist('tmp2/c/d.css').should.be.false;
  });

  it('each method', function(){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    var options = {};
    fu.each('tmp', function(item){
      fu.exist(item.name).should.be.true;
    }, options);

    options = {excludeFile:true};
    fu.each('tmp', function(item){
      fu.isDirectory(item.name).should.be.true;
    }, options);

    options = {excludeDirectory:true};
    fu.each('tmp', function(item){
      fu.isFile(item.name).should.be.true;
    }, options);

    var mc = function(item){return item.name.match(/\.js$/i);}
    options = {matchFunction:mc};
    fu.each('tmp', function(item){
      fu.extname(item.name).should.equal('js');
    }, options);

  });

  it('each method sync mode', function(){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    var s = [];
    fu.each('tmp', function(item){
      s.push(item);
    }, {sync: true});
    (s.length == 4).should.be.true;
  });

  it('each method asyn mode', function(done){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    var s = [];

    fu.each('tmp', function(item){
      s.push(item);
    }, {sync: false}, function(){
      (s.length == 4).should.be.true;
      done();
    });
    (s.length == 0).should.be.true;
  });

  it('list method list file', function(){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    fu.list('tmp').length.should.equal(4);
    fu.list('tmp', {excludeFile: true}).length.should.equal(2);
    fu.list('tmp', {excludeDirectory: true}).length.should.equal(2);
    var mc = function(item){return item.name.match(/\.js$/i);}
    fu.list('tmp', {matchFunction: mc}).length.should.equal(1);
  });

  it('list method return file name', function(){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    var list = fu.list('tmp');
    (list[0].name == undefined).should.be.true;
  });

  it('list method return file name', function(){
    fu.touch(['tmp/a/b.js', 'tmp/c/d.css']);
    var list = fu.list('tmp', null, true);
    (list[0].name == undefined).should.be.false;
  });
  
  


});