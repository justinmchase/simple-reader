import { app, BrowserWindow } from 'electron'
import { register } from './protocol'
import minimist from 'minimist'

const protocol = 'raw-reader://'
const protocolS = 'raw-reader-s://'
let win

function createWindow (urls) {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL(`file://${__dirname}/app/index.html`)
  win.webContents.on('did-finish-load', () => sendUrls(urls))
  win.on('closed', () => {
    win = null
  })
}

function sendUrls (urls) {
  urls.forEach(url => {
    url = url
      .replace(protocol, 'http://')
      .replace(protocolS, 'https://')

    if (url.match(/\/$/)) url = url.slice(0, -1)
    win.webContents.send('url', url)
  })
}

function openUrl (argv) {
  let args = minimist(argv.slice(2))
  let urls = args._.filter(arg => arg.indexOf(protocol) === 0 || arg.indexOf(protocolS) === 0)
  if (!urls.length) return app.quit()
  if (win) {
    // The window is already shown
    if (win.isMinimized()) {
      win.restore()
    } else {
      win.focus()
    }
    sendUrls(urls)
  } else {
    createWindow(urls)
  }
}

function ready () {
  if (app.makeSingleInstance(openUrl)) app.quit()
  else openUrl(process.argv)
}


app.on('ready', ready)
app.on('window-all-closed', () => process.platform !== 'darwin' ? app.quit() : null)
app.on('open-url', openUrl)

register()
