/*!
 * create-readdir-stream <https://github.com/tunnckoCore/create-readdir-stream>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('mukla')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var includes = require('arr-includes')
var createReaddirStream = require('./index')

test('should throw TypeError if `dir` not a string or buffer', function (done) {
  function fixture () {
    createReaddirStream(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `dir` to be a string or Buffer/)
  done()
})

test('should emit `error` event if fs.readdir fails', function (done) {
  var app = createReaddirStream('./not-existing-dir')
  app.once('error', function (err) {
    test.ifError(!err)
    test.ok(/no such file or directory/.test(err.message))
    done()
  })
})

test('should emit `error` if directory is empty', function (done) {
  mkdirp.sync('./empty-folder')
  createReaddirStream('./empty-folder')
    .once('error', function (err) {
      test.ifError(!err)
      test.ok(/directory is empty/.test(err.message))
      rimraf.sync('./empty-folder')
      done()
    })
})

test('should have `.use` method for plugins api', function (done) {
  var app = createReaddirStream(__dirname)
  test.strictEqual(typeof app.use, 'function')
  done()
})

test('should create `.foobar` method from a plugin', function (done) {
  var app = createReaddirStream(__dirname)
  app.use(function (app) {
    app.foobar = function () {}
  })
  test.strictEqual(typeof app.foobar, 'function')
  done()
})

test('should push all filepaths to stream', function (done) {
  var files = []
  createReaddirStream(__dirname)
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
