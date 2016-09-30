import url from 'url'
import request from 'request'
import unfluff from 'unfluff'
import moment from 'moment'
import { summarize } from 'node-summary'
import { shell } from 'electron'
import file from '../file'

function Model () {
  this.state = 'loading'
  this.mode = 'summary'
  this.reqCount = 0
}

function isReady () {
  return this.state === 'ready'
}

function summarized (data) {
  this.data = data
  this.state = 'ready'
  console.log(data)
}

function error (err) {
  this.state = 'error'
  this.error = err
  console.error(err)
}

function openSource (src) {
  shell.openExternal(src)
}

function showText () {
  this.mode = 'text'
}

function showSummary () {
  this.mode = 'summary'
}

function ready () {
  this.state = 'analyzing'
  request.get(this.item.url, (err, res, body) => {
    if (err) return this.error(err)
    let data = unfluff(body, 'en')
    summarize(data.title, data.text, (err, summary) => {
      if (err) return this.error(err)
      data.summary = summary
      if (data.date) data.date = moment(data.date).format('LL')
      this.item.title = data.title
      this.summarized(data)
    })
  })
}

export default {
  template: file(__dirname, 'content.html'),
  props: [ 'item' ],
  data: () => new Model(),
  methods: {
    error,
    openSource,
    summarized,
    showText,
    showSummary
  },
  computed: {
    isReady
  },
  events: {
    'hook:ready': ready
  }
}
