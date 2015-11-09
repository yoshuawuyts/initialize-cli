#!/usr/bin/env node
const cliclopts = require('cliclopts')
const minimist = require('minimist')
const pump = require('pump')
const util = require('util')
const fs = require('fs')

const pkg = require('../package.json')
const main = require('../')

const opts = cliclopts([
  {
    name: 'help',
    abbr: 'h',
    boolean: true
  },
  {
    name: 'version',
    abbr: 'v',
    boolean: true
  }
])

const argv = minimist(process.argv.slice(2), opts.options())

// parse options
if (argv.version) {
  const version = require('../package.json').version
  process.stdout.write('v' + version + '\n')
  process.exit(0)
} else if (argv.help) {
  process.stdout.write(pkg.name + ' - ' + pkg.description + '\n')
  usage(0)
} else if (!argv._.length) {
  process.stderr.write('Error: no command specified\n')
  usage(1)
} else {
  main(argv, function (err) {
    if (err) process.stderr.write(util.format(err) + '\n')
    process.exit(err ? 1 : 0)
  })
}

// print usage & exit
// num? -> null
function usage (exitCode) {
  const rs = fs.createReadStream(__dirname + '/usage.txt')
  const ws = process.stdout
  pump(rs, ws, process.exit.bind(null, exitCode))
}
