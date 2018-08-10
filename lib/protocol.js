import path from 'path'
import { app } from 'electron'

const protocol = 'reader'
const args = [protocol, process.execPath, [path.join(__dirname, '..', 'index.js')]]
const check = () => app.isDefaultProtocolClient.apply(app, args)
const set = () => app.setAsDefaultProtocolClient.apply(app, args)
const rem = () => app.removeAsDefaultProtocolClient.apply(app, args)

export function register () {
  if (!check()) {
    console.log(`protocol handler set for ${protocol}://`)
    set()
  }
}

export function unregister () {
  if (check()) {
    console.log(`protocol handler removed for ${protocol}://`)
    rem()
  }
}
