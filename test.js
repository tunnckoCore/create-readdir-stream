/*!
 * create-readdir-stream <https://github.com/tunnckoCore/create-readdir-stream>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('mukla')
var utils = require('./utils')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var includes = require('arr-includes')
var readdir = require('./index')
var nanomatch = require('nanomatch')
var Ctor = require('./index').CreateReaddirStream

test('should `.createReaddirStream` throw TypeError if `dir` not a string or buffer', function (done) {
  function fixture () {
    readdir.createReaddirStream(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `dir` to be a string or Buffer/)
  done()
})

test('should `.createReaddirStream` emit `error` event if fs.readdir fails', function (done) {
  var stream = readdir.createReaddirStream('./not-existing-dir')
  stream.once('error', function (err) {
    test.ifError(!err)
    test.ok(/no such file or directory/.test(err.message))
    done()
  })
})

test('should `.createReaddirStream` emit `error` if directory is empty', function (done) {
  mkdirp.sync('./empty-folder')
  var app = new Ctor()
  app.createReaddirStream('./empty-folder')
    .once('error', function (err) {
      test.ifError(!err)
      test.ok(/directory is empty/.test(err.message))
      rimraf.sync('./empty-folder')
      done()
    })
})

test('should expose constructor `CreateReaddirStream`', function (done) {
  var app = new Ctor()
  test.strictEqual(typeof Ctor, 'function')
  test.strictEqual(typeof app.createReaddirStream, 'function')
  done()
})
test('should exposed instance have `.use` method for plugins api', function (done) {
  test.strictEqual(typeof readdir.use, 'function')
  done()
})

test('should exposed instance create `.foobar` method from a plugin', function (done) {
  readdir.use(function (app) {
    app.foobar = function () {}
  })
  test.strictEqual(typeof readdir.foobar, 'function')
  done()
})

test('should push all filepaths to stream', function (done) {
  var files = []
  var app = new Ctor()
  app.createReaddirStream(__dirname)
    .on('data', function (file) {
      files.push(file.basename)
    })
    .once('end', function () {
      test.strictEqual(includes(files, [
        '.editorconfig',
        'index.js',
        'README.md',
        'LICENSE'
      ]), true)
      done()
    })
})

test('should expose `options.plugin` to filter paths that will be passed to stream', function (done) {
  var files = []
  var app = Ctor({
    // must return paths
    // perfect place for globbing library
    // such as `minimatch`, `micromatch`, `nanomatch`
    plugin: function (paths) {
      test.strictEqual(Array.isArray(paths), true)
      test.strictEqual(typeof this.use, 'function')
      test.strictEqual(typeof this.createReaddirStream, 'function')
      return nanomatch(paths, ['*.js', '*.json'])
    }
  })
  app.use(function () {
    return function (file) {
      files.push(file.basename)
    }
  })
  app.createReaddirStream('./')
    .once('end', function () {
      test.strictEqual(includes(files, [
        'test.js',
        'index.js',
        'utils.js',
        'example.js',
        'package.json'
      ]), true)
      done()
    })
})

test('should exclude file if `file.exclude = true` from plugin', function (done) {
  var files = []
  readdir.use(function () {
    return function (file) {
      if (file.basename === 'index.js') {
        file.exclude = true
      }
    }
  })
  .createReaddirStream('./')
  .pipe(utils.through2.obj(function (file, enc, cb) {
    files.push(file)
    cb()
  }))
  .once('finish', function () {
    test.strictEqual(includes(files, ['index.js']), false)
    done()
  })
})
