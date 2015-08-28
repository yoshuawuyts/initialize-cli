# initialize-cli
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![Downloads][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

Generate base CLI files. Run on an existing repo.

## Installation
```sh
$ npm install initialize-cli
```

## Usage
```txt
initialize-cli - Generate base cli files

Usage: initialize-cli [options]

Options:
  -h, --help        Output usage information
  -v, --version     Output version number
  -d, --directory   Specify output directory

Examples:
  $ initialize-cli   # generate base cli files

Docs: https://github.com/yoshuawuyts/initialize-cli
Bugs: https://github.com/yoshuawuyts/initialize-cli/issues
```

## API
### initialize-cli

## Variables
The following variables are used in the templates:
```txt
name          The module's name
description   The module's description
repository    The module's repository
```

## See Also
- [initialize](https://github.com/yoshuawuyts/initialize)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[npm-image]: https://img.shields.io/npm/v/initialize-cli.svg?style=flat-square
[npm-url]: https://npmjs.org/package/initialize-cli
[travis-image]: https://img.shields.io/travis/yoshuawuyts/initialize-cli/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/yoshuawuyts/initialize-cli
[codecov-image]: https://img.shields.io/codecov/c/github/yoshuawuyts/initialize-cli/master.svg?style=flat-square
[codecov-url]: https://codecov.io/github/yoshuawuyts/initialize-cli
[downloads-image]: http://img.shields.io/npm/dm/initialize-cli.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/initialize-cli
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
