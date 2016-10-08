'use strict'

var Readdir = require('./ctor')

var app = Readdir()

// app.use(function (app) {
//   // should be called before `.readdir`
//   app.src = function src (patterns, options) {
//     this.options.plugin = function globPlugin (paths) {
//       return micromatch(paths, patterns, options)
//     }
//     return this
//   }
// })
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
  .readdir('./')
  // this one is `app.pipe` not `stream.pipe`
  // it is just a sugar for through2 object mode
  .pipe(function (file, cb) {
    // `this` context is stream, not a file!!
    console.log('pipe 1', file.path)
    this.push(file)
    cb()
  })
  .pipe(function (file, cb) {
    // `this` context is stream, not a file!!
    console.log('pipe 2', file.path)
    this.push(file)
    cb()
  })
  // try this one:
  // .stream.pipe(through2.obj(fn))
