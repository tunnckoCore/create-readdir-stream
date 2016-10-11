# [create-readdir-stream][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url] 

> Get contents of the folder in streaming mode with support for plugins. No recursion. No globs - possible through plugin. It is like and follows `fs.createReadStream` signature and semantics

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

## Install

```
npm i create-readdir-stream --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const createReaddirStream = require('create-readdir-stream')
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

### [.createReaddirStream](index.js#L79)

> Reads a `dir` contents, creates [vinyl][] file
from each filepath, after that push them to stream.

**Params**

* `<dir>` **{String|Buffer}**: buffer or string folder/directory to read    
* `[options]` **{Object}**: options are [extend-shallow][]ed with `this.options`    
* `returns` **{Stream}**: Transform Stream, [through2][]  

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