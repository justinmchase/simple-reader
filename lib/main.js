import { app, BrowserWindow } from 'electron'
import { register } from './protocol'
import minimist from 'minimist'

const protocol = 'reader://'
const protocolRegex = new RegExp(`^${protocol}`)
let win

function createWindow (urls) {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  const file = `file://${__dirname}/app/index.html`
  console.log('opening window: ', file)
  win.loadURL(file)
  win.webContents.on('did-finish-load', () => sendUrls(urls))
  win.on('closed', () => {
    win = null
  })
}

function sendUrls (urls) {
  urls.forEach(url => {
    url = decodeURI(url.replace(protocolRegex, ''))
    if (url.match(/\/$/)) url = url.slice(0, -1)
    win.webContents.send('url', url)
  })
}

function openUrl (argv) {
  let args = minimist(argv.slice(2))
  let urls = args._.filter(arg => arg.indexOf(protocol) === 0)
  if (!urls.length) {
    console.log('Please provide a reader url.')
    console.log('e.g. reader://https%3A%2F%2Fmedium.com%2Fs%2Fstory%2Fwhy-you-can-never-eat-just-one-oreo-13b9c95c75bd')
    return app.quit()
  }
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
