/*!
 * create-readdir-stream <https://github.com/tunnckoCore/create-readdir-stream>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var path = require('path')
var utils = require('./utils')

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
      stream.push(new utils.File({
        cwd: opts.cwd,
        path: path.join(dir, fp)
      }))

      if ((idx + 1) === stream.files.length) {
        stream.push(null)
      }
    })
  })

  return stream
}
