import { shell } from 'electron'
import file from '../file'

function Model () {
  this.state = 'loading'
  this.reqCount = 0
}

function webviewStartLoad (event) {
  if (this.intervalId) clearInterval(this.intervalId)
}

function webviewLoaded () {
  this.webview.stop()
}

function webviewLoadStopped () {
  if (this.state === 'loading') {
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = setInterval(check.bind(this), 1000)
  }
}

function check () {
  console.log('sending ping...')
  if (this.state === 'loading') {
    this.state = 'analyzing'
    this.webview.send('analysis-start')
    this.webview.openDevTools()
    clearInterval(this.intervalId)
  }
}

function webviewFailed () {
  console.error(arguments)
}

function webviewMessage (event) {
  if (event.channel === 'analysis-error') {
    console.error(event)
  }
  if (event.channel === 'analysis-results') {
    this.data = event.args[0]
    this.state = 'ready'
    console.log(this.data)
  }
}

function webviewResponseDetails (event) {
  // console.log(event)
}

function isReady () {
  return this.state === 'ready'
}

function error (err) {
  this.state = 'error'
  this.error = err
  console.error(err)
}

function openSource () {
  shell.openExternal(this.src)
}

function ready () {
  this.webview = document.querySelector('#actual')
  this.webview.addEventListener('did-start-loading', webviewStartLoad.bind(this))
  this.webview.addEventListener('did-stop-loading', webviewLoadStopped.bind(this))
  this.webview.addEventListener('did-finish-load', webviewLoaded.bind(this))
  this.webview.addEventListener('did-fail-load', webviewFailed.bind(this))
  this.webview.addEventListener('did-get-response-details', webviewResponseDetails.bind(this))
  this.webview.addEventListener('ipc-message', webviewMessage.bind(this))
}

export default {
  template: file(__dirname, 'content.html'),
  props: [ 'src' ],
  data: () => new Model(),
  methods: {
    error,
    openSource
  },
  computed: {
    isReady
  },
  events: {
    'hook:ready': ready
  }
}
