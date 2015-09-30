const spawn = require('child_process').spawn
const concat = require('concat-stream')
const readdirp = require('readdirp')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const path = require('path')
const test = require('tape')
const uuid = require('uuid')

test('should create files', function (t) {
  t.plan(5)

  mkdirp('tmp', function (err, res) {
    t.error(err)

    const route = path.join(process.cwd(), 'tmp', uuid.v1().slice(0, 6))
    const cmd = path.join(__dirname, 'bin/cli.js')
    const ps = spawn(cmd, [ '-d', route ])

    // ps.stdout.pipe(process.stdout) // uncomment in case of bugs
    ps.stderr.pipe(process.stderr)
    ps.stdout.on('end', verify)

    function verify () {
      const opts = { root: route, directoryFilter: '!node_modules' }
      readdirp(opts).pipe(concat({ object: true }, function (arr) {
        t.ok(Array.isArray(arr), 'is array')

        arr = arr.map(function (obj) { return obj.name })
        t.notEqual(arr.indexOf('cli.js'), -1, 'bin/cli.js exists')
        t.notEqual(arr.indexOf('usage.txt'), -1, 'bin/usage.txt exists')

        rimraf(path.join(process.cwd(), 'tmp'), function (err) {
          t.error(err)
        })
      }))
    }
  })
})
