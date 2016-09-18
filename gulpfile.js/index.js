require('babel-core/register')({
  presets: [ 'es2015' ]
})
require('require-dir')('./tasks', { recurse: true })
