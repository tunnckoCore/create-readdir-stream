/*!
 * create-readdir-stream <https://github.com/tunnckoCore/create-readdir-stream>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var path = require('path')
var utils = require('./utils')

/**
 * > Creates a stream from a `dir` contents, without
 * recursion and without globs. Support plugins, using [use][].
 * It pushes [vinyl][] files to the stream, but files does
 * not have `.contents` and `.stat`. It **not reads** the files,
 * because this is up to the user.
 *
 * **Example**
 *
 * > Below example shows how you can create glob plugin using
 * the [micromatch][] globbing library. Only files that
 * pass the patterns will be pushed to stream!
 *
 * ```js
 * var extend = require('extend-shallow')
 * var through2 = require('through2')
 * var micromatch = require('micromatch')
 * var readdir = require('create-readdir-stream')
 *
 * var app = readdir('./')
 * var patterns = ['*.md', '!index.js', '*.js']
 *
 * app.use(glob(patterns))
 *   .pipe(through2.obj(function (file, enc, cb) {
 *     console.log(file.basename)
 *     cb()
 *   }))
 *
 * function glob (patterns, options) {
 *   return function (stream) {
 *     // stream.files === undefined
 *
 *     return function (stream) {
 *       // this.files === stream.files
 *       // files are coming from `fs.readdir` directly
 *
 *       // this function WON'T be called
 *       // if there's some errors reading the directory.
 *
 *       // force `nodupes` option, it is good deal
 *       options = extend({}, options, { nodupes: true })
 *       this.files = micromatch(this.files, patterns, options)
 *     }
 *   }
 * }
 * ```
 *
 * @param  {String|Buffer} `dir` directory to read
 * @param  {Object} `opts` passed directly to [through2][] and [vinyl][]
 * @return {Stream} transform stream with additional `.use` method
 * @api public
 */

module.exports = function createReaddirStream (dir, opts) {
  dir = utils.isBuffer(dir) ? dir.toString() : dir

  if (typeof dir !== 'string') {
    var msg = 'expect `dir` to be a string or Buffer'
    throw new TypeError('create-readdir-stream: ' + msg)
  }

  opts = utils.extend({ cwd: process.cwd() }, opts, {
    objectMode: true
  })
  dir = path.resolve(opts.cwd, dir)

  var stream = utils.use(utils.through2(opts))
  utils.fs.readdir(dir, function (err, files) {
    if (err) {
      stream.emit('error', err)
      return
    }

    stream.files = files
    // notice that plugins WON'T
    // be even called if there's an error!
    stream.run(stream)

    if (!stream.files.length) {
      var msg = 'directory is empty: ' + dir
      var er = new Error('create-readdir-stream: ' + msg)
      stream.emit('error', er)
      return
    }

    stream.files.forEach(function (fp, idx) {
      var config = utils.extend(opts, {
        cwd: opts.cwd,
        path: path.join(dir, fp)
      })
      stream.push(new utils.File(config))

      if ((idx + 1) === stream.files.length) {
        stream.push(null)
      }
    })
  })

  return stream
}
