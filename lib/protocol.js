import path from 'path'
import { app } from 'electron'

let proto = 'raw-reader'
let protoS = 'raw-reader-s'

let args = [process.execPath, [path.join(__dirname, '..', 'index.js')]]
let check = (a) => app.isDefaultProtocolClient.apply(app, a)
let set = (a) => app.setAsDefaultProtocolClient.apply(app, a)
let rem = (a) => app.removeAsDefaultProtocolClient.apply(app, a)

export function register () {
  var p = [proto].concat(args)
  var ps = [protoS].concat(args)
  if (!check(p)) set(p)
  if (!check(ps)) set(ps)
}

export function unregister () {
  var p = [proto].concat(args)
  var ps = [protoS].concat(args)
  if (check(p)) rem(p)
  if (check(ps)) rem(ps)
}
