/*!
 * create-readdir-stream <https://github.com/tunnckoCore/create-readdir-stream>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var path = require('path')
var utils = require('./utils')

function Readdir (options) {
  if (!(this instanceof Readdir)) {
    return new Readdir(options)
  }

  utils.use(this)
  this.initDefaults(options)
}

Readdir.prototype.initDefaults = function initDefaults (options) {
  this.options = utils.extend({
    cwd: process.cwd(),
    file: {
      include: true,
      exclude: false,
      options: {}
    }
  }, options, {
    objectMode: true
  })
  this.stream = utils.through2(this.options)
  return this
}

Readdir.prototype.readdir = function readdir (dir, options) {
  dir = utils.isBuffer(dir) ? dir.toString() : dir

  if (typeof dir !== 'string') {
    var msg = 'expect `dir` to be a string or Buffer'
    throw new TypeError('[create-readdir-stream] .readdir: ' + msg)
  }

  this.options = utils.extend(this.options, options)
  this.rootDir = path.resolve(this.options.cwd, dir)

  utils.fs.readdir(this.rootDir, function (err, paths) {
    if (err) {
      err.message = '[create-readdir-stream] .readdir: '
      err.message += err.message

      this.stream.emit('error', err)
      return
    }
    if (!paths.length) {
      var msg = 'directory is empty: ' + this.rootDir
      var er = new Error('[create-readdir-stream] .readdir: ' + msg)
      this.stream.emit('error', er)
      return
    }

    this.paths = paths

    // Should return paths!
    // Perfect place for globbing library
    // such as `micromatch`
    if (typeof this.options.plugin === 'function') {
      this.paths = this.options.plugin.call(this, this.paths)
    }

    // Change all paths to Vinyl files
    // and push them to stream.
    this.paths.forEach(function (fp, idx) {
      // Allow user to add to
      // each file what he want
      var config = utils.extend(this.options.file, {
        cwd: this.options.cwd,
        path: path.join(this.rootDir, fp)
      })

      // Write to instance intentionally and after
      // that pass it to each plugin.
      this.file = new utils.File(config)

      // Each plugin's `this` context is the File
      // So this allows to modify through using `this`
      // in the plugin, instead of only `file` argument.
      // For example `this.path = 'foobar'` or `file.path = 'foobar'`
      // both would work.
      this.run(this.file)

      // Allow users to choose which file should be pushed to stream.
      // For example:
      // pass `file.exclude = true` or `file.include = false` to some
      // file and it won't be pushed to the stream.
      if (this.file.include === true && this.file.exclude === false) {
        this.stream.push(this.file)
      }

      var shouldClose = (idx + 1) === this.paths.length
      if (shouldClose) {
        this.stream.push(null)
      }
    }, this)
  }.bind(this))

  // or `this.stream`
  return this
}

/**
 * > Sugar for `stream.pipe(through2.obj(fn))`, returning
 * this instance for chaining. The `fn`s `this` context
 * will be a transform stream. Arguments of the `fn` will
 * be just `file, cb`.
 *
 * @param  {Function} `fn` function to be called inside `through2.obj()`
 * @return {Readdir} `this` instance for chaining
 */
Readdir.prototype.pipe = function pipeSugar (fn) {
  if (typeof fn !== 'function') {
    var msg = 'expect `fn` to be a fucntion'
    throw new TypeError('[create-readdir-stream] .pipeline: ' + msg)
  }

  this.stream = this.stream.pipe(utils.through2.obj(function (file, enc, cb) {
    fn.call(this, file, cb)
  }))
  return this
}

module.exports = Readdir
