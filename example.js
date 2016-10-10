/*!
 * create-readdir-stream <https://github.com/tunnckoCore/create-readdir-stream>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var app = require('./index')
var utils = require('./utils')

app.use(function (app) {
  // `this` === `app`
  // called only once and immediately
  // console.log(this)
  return function (file) {
    // `this` === `file`
    if (file.extname === '.js' || file.extname === '.md' || file.basename[0] === '.') {
      file.include = false
      // or file.exclude = true
    } else {
      // output only these that will be
      // included in the stream
      console.log('plugin', file.path)
    }
  }
})

app
  .createReaddirStream('./')
  .once('error', console.error)
  .pipe(utils.through2.obj(function (file, enc, cb) {
    // `this` context is stream, not a file!!
    console.log('pipe', file.path)
    this.push(file)
    cb()
  }))
