import path from 'path'
import { app } from 'electron'

let protocol = 'reader'

let args = [process.execPath, [path.join(__dirname, '..', 'index.js')]]
let check = (a) => app.isDefaultProtocolClient.apply(app, a)
let set = (a) => app.setAsDefaultProtocolClient.apply(app, a)
let rem = (a) => app.removeAsDefaultProtocolClient.apply(app, a)

export function register () {
  var p = [protocol].concat(args)
  if (!check(p)) set(p)
}

export function unregister () {
  var p = [protocol].concat(args)
  if (check(p)) rem(p)
}
