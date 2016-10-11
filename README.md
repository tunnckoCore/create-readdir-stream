# [create-readdir-stream][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url] 

> Streaming `fs.readdir`, extensible with smart plugins. No recursion and no globs by default - [use][] plugins. Does not stat and doesn't read the filepaths - use plugins. It just push [vinyl][] files to stream. Follows signature and semantics of `fs.createReadStream` method.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

## Install

```
npm i create-readdir-stream --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const readdir = require('create-readdir-stream')
```

### [CreateReaddirStream](index.js#L32)
> Initialize `CreateReaddirStream` with default `options`.

**Params**

* `[options]` **{Object}**: one of them is `cwd`.    

**Example**

```js
const inst = require('create-readdir-stream')

console.log(inst.use) // => 'function'
console.log(inst.createReaddirStream) // => 'function'

// or get constructor
const Readdir = require('create-readdir-stream').CreateReaddirStream
```

### [.use](index.js#L118)
> Smart plugins support using [use][]. It just calls that `fn` immediately and if it returns function again it is called (**only when** `.createReaddirStream` is called) with `file` argument ([vinyl][] file) for each item in the returned array by `fs.readdir`.

**Params**

* `<fn>` **{Function}**: plugin to be called immediately    
* `returns` **{CreateReadStream}**: this instance for chaining  

**Example**

```js
const through2 = require('through2')
const readdir = require('create-readdir-stream')

readdir.use(function (app) {
  // both `this` and `app` are the instance aka `readdir`
  // called immediately

  // below function IS NOT called immediately it is
  // called only when `.createReaddirStream` is called
  return function (file) {
    // both `this` and `file` are Vinyl virtual file object
    // called on each filepath. Or in other words
    // this function is called on each item in
    // returned array by `fs.readdir`

    // exclude `index.js` from been pushed to stream
    if (file.basename === 'index.js') {
      file.exclude = true
      // or file.include = false
    }
    console.log('from plugin', file.basename)
  }
})

readdir
  .createReaddirStream('./')
  .once('error', console.error)
  .pipe(through2.obj(function (file, enc, cb) {
    // you should NOT expect to see `index.js` here :)
    console.log('from pipe', file.basename)
    cb()
  }))
```

### [.createReaddirStream](index.js#L144)
> Reads a `dir` contents, creates [vinyl][] file from each filepath, after that push them to stream.

**Params**

* `<dir>` **{String|Buffer}**: buffer or string folder/directory to read    
* `[options]` **{Object}**: options are [extend-shallow][]ed with `this.options`    
* `returns` **{Stream}**: Transform Stream, [through2][]  

**Example**

```js
const th2 = require('through2')
const fs2 = require('create-readdir-stream')

// same signature and api as `fs.createReadStream`
fs2.createReaddirStream('./')
  .once('error', console.error)
  .pipe(th2.obj(function (file, enc, cb) {
    console.log('from pipe', file.basename)
    cb()
  }))
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/create-readdir-stream/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[micromatch]: https://github.com/jonschlinkert/micromatch
[through2]: https://github.com/rvagg/through2
[use]: https://github.com/jonschlinkert/use
[vinyl]: https://github.com/gulpjs/vinyl

[npmjs-url]: https://www.npmjs.com/package/create-readdir-stream
[npmjs-img]: https://img.shields.io/npm/v/create-readdir-stream.svg?label=create-readdir-stream

[license-url]: https://github.com/tunnckoCore/create-readdir-stream/blob/master/LICENSE
[license-img]: https://img.shields.io/npm/l/create-readdir-stream.svg

[downloads-url]: https://www.npmjs.com/package/create-readdir-stream
[downloads-img]: https://img.shields.io/npm/dm/create-readdir-stream.svg

[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/create-readdir-stream
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/create-readdir-stream.svg

[travis-url]: https://travis-ci.org/tunnckoCore/create-readdir-stream
[travis-img]: https://img.shields.io/travis/tunnckoCore/create-readdir-stream/master.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/create-readdir-stream
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/create-readdir-stream.svg

[david-url]: https://david-dm.org/tunnckoCore/create-readdir-stream
[david-img]: https://img.shields.io/david/tunnckoCore/create-readdir-stream.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg

[extend-shallow]: https://github.com/jonschlinkert/extend-shallow