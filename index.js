const readPackage = require('read-closest-package')
const copy = require('copy-template-dir')
const mapLimit = require('map-limit')
const eos = require('end-of-stream')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')

module.exports = initializeCli

// Create a fresh cli
// (obj, fn) -> null
function initializeCli (argv, cb) {
  argv.dependencies = [ 'cliclopts', 'minimist' ]
  const tasks = [ mkdir, copyFiles, parsePkg, setMod ]

  mapLimit(tasks, 1, iterator, cb)
  function iterator (fn, next) {
    fn(argv, next)
  }
}

// change to directory
// (obj, fn) -> null
function mkdir (argv, cb) {
  const dir = argv.directory
  mkdirp(dir, function (err) {
    if (err) return cb(err)
    process.chdir(dir)
    cb()
  })
}

// copy files from dir to dist
// (obj, fn) -> null
function copyFiles (argv, cb) {
  const inDir = path.join(__dirname, 'templates')
  copy(inDir, process.cwd(), argv, cb)
}

// find the nearest package.json
// and save the values as vars
// (obj, fn) -> null
function parsePkg (argv, next) {
  readPackage(function (err, pkg, loc) {
    if (err) return next(err)

    argv.description = pkg.description
    argv.repository = pkg.repository
    argv.name = pkg.name

    pkg.bin = {}
    pkg.bin[pkg.name] = './bin/cli.js'

    const ws = fs.createWriteStream(loc)
    ws.end(JSON.stringify(pkg, null, 2))
    eos(ws, next)
  })
}

// change permissions on executable
// (obj, fn) -> null
function setMod (argv, next) {
  const route = path.join(process.cwd(), 'bin/cli.js')
  fs.chmod(route, 755, next)
}
