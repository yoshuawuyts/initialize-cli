const readPackage = require('read-closest-package')
const engine = require('initialize-engine')
const closest = require('closest-package')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')

const opts = {
  templates: path.join(__dirname, 'templates'),
  pre: [
    chdir,
    parsePackage,
    attachBin
  ],
  files: [
    'bin/cli.js',
    'bin/usage.txt'
  ],
  dependencies: [
    'cliclopts',
    'minimist'
  ]
}

module.exports = create
create.opts = opts

// create
// (obj, fn) -> null
function create (argv, cb) {
  engine(opts, argv, cb)
}

// change to directory
// (obj, fn) -> null
function chdir (argv, next) {
  const dir = argv.d ? path.resolve(argv.d) : process.cwd()
  mkdirp(path.join(dir, 'bin'), function (err) {
    if (err) return next(err)
    process.chdir(dir)

    // modify dir path so future commands don't double reference
    const last = argv.directory.length - 1
    argv.directory = argv.directory.split('/').splice(last, 1).join('/')
    next()
  })
}

// find the nearest package.json
// and save the values as vars
// (obj, fn) -> null
function parsePackage (argv, next) {
  readPackage(function (err, pkg) {
    if (err) return next(err)
    argv.description = pkg.description
    argv.repository = pkg.repository
    argv.name = pkg.name
    next()
  })
}

// extend the target package.json
// with a 'bin' command
// (obj, fn) -> null
function attachBin (argv, next) {
  var filename = null
  var json = null

  closest(path.dirname('.'), findPath, function (err) {
    if (err) return next(err)

    const pkgName = json.name
    json.bin = {}
    json.bin[pkgName] = './bin/cli.js'

    const ws = fs.createWriteStream(filename)
    ws.end(JSON.stringify(json, null, 2))
    ws.on('error', next)
    ws.on('finish', next)
  })

  function findPath (data, file) {
    filename = file
    json = data
    return true
  }
}
