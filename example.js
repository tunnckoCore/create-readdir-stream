/*!
 * create-readdir-stream <https://github.com/tunnckoCore/create-readdir-stream>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var extend = require('extend-shallow')
var through2 = require('through2')
var micromatch = require('micromatch')
var createReaddirStream = require('./index')

function globPlugin () {
  return function (app) {
    // this === app
    // perfect place for extending the
    // app, which is stream with methods
    // such as `.src`!

    /**
     * Adds `.src` method to your app, which
     * accepts glob `patterns` and `options`
     * both directly passed to `micromatch`.
     *
     * **Example**
     *
     * ```js
     * var createReaddirStream = require('create-readdir-stream')
     * var app = createReaddirStream('./').use(globPlugin())
     *
     * app.src(['!index.js', *.js'])
     *   .pipe(through2.obj(fn))
     *   .pipe(through2.obj(fn))
     * ```
     *
     * @name   .src
     * @param  {String|Array} `patterns` glob patterns
     * @param  {Object} `options` optional options passed to `micromatch`
     * @return {Stream} app/this/stream for chaining
     */

    this.src = function src (patterns, options) {
      this.use(function () {
        return function (stream) {
          // perfect place for globbing
          // library like `micromatch`
          // only files which pass `patterns`
          // will be pushed to `stream`

          // this === app === stream
          // this.files === stream.files === all files in directory

          // force `nodupes` option is really big deal
          // intentionally can't be overridden
          // hence, why you will need such thing?
          options = extend(options, { nodupes: true })
          this.files = micromatch(this.files, patterns, options)
        }
      })
      return this
    }
  }
}

/**
 * Example usage
 */

var app = createReaddirStream('./')

app
  .use(globPlugin())
  // only these files will be pushed to stream!!
  .src(['*.md', '!index.js', '*.js'])
  .pipe(through2.obj(function (file, enc, cb) {
    console.log('pipe 1:', file)
    cb(null, file)
  }))
  .pipe(through2.obj(function (file, enc, cb) {
    console.log('pipe 2:', file)
    cb()
  }))
