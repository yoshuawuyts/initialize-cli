const readPackage = require('read-closest-package')
const install = require('npm-install-package')
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
  argv.dependencies = [ 'cliclopts', 'minimist', 'pump' ]
  const tasks = [ mkdir, parsePkg, copyFiles, setMod, installDeps ]

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

// copy files from dir to dist
// (obj, fn) -> null
function copyFiles (argv, cb) {
  const inDir = path.join(__dirname, 'templates')
  copy(inDir, process.cwd(), argv, cb)
}

// change permissions on executable
// (obj, fn) -> null
function setMod (argv, next) {
  const route = path.join(process.cwd(), 'bin/cli.js')
  fs.chmod(route, '755', next)
}

// install dependencies from npm for app-main
// (obj, cb) -> null
function installDeps (argv, next) {
  const opts = { save: true, cache: true }
  install(argv.dependencies, opts, function (err) {
    if (err) return next(err)
    process.chdir(path.join(process.cwd(), '..'))
    next()
  })
}
