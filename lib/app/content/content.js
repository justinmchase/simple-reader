import popsicle from 'popsicle'
import unfluff from 'unfluff'
import { nutshell } from 'in-a-nutshell'
import wordcount from 'wordcount'
import { shell } from 'electron'
import file from '../file'

const { keys, assign } = Object

function Model () {
  this.state = 'loading'
  this.mode = 'summary'
  this.errors = []
  this.data = {}
  this.reqCount = 0
}

function isReady () {
  return this.state === 'ready'
}

function summarized (data) {
  this.state = 'ready'
  this.data = data
  console.log('summarized:', this.data)
}

function error (err) {
  this.state = 'error'
  err = typeof err === 'object' ? err : new Error(err)
  this.data = {}
  this.errors = [keys(err).reduce((o, k) => assign(o, { [k]: o[k] }), { message: err.message, stack: err.stack })]
  console.error('error:', this.errors)
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
  console.log('analyzing:', this.item.url)
  popsicle(this.item.url)
    .on('progress', p => console.log(p))
    .on('error', err => this.error(err))
    .then((res) => {
      const { status, headers, body } = res
      console.log('status:', status)
      console.log('headers:', headers)

      // Summarize the text of the page
      const data = unfluff(body)
      const { text } = data

      if (!text) {
        return this.summarized({
          summary: 'Unable to find anything worth summarizing!'
        })
      }
      const summary = nutshell(text, 5, 'html')

      // Get stats about the summary
      const textCount = wordcount(text)
      const summaryCount = wordcount(summary)
      const compression = (100 - Math.trunc(100 * (summary.length / (text || body).length)))
      const timeSaved = (textCount - summaryCount) / 200
      console.log(timeSaved)
      const m = Math.trunc(timeSaved)
      const s = Math.trunc((timeSaved % 1) * 60)
      const stats = [
        `${textCount} words, down to ${summaryCount} words`,
        `${compression}% compressed`,
        `${m}m${s}s saved (@ 200wpm)`
      ]
      this.summarized(assign(data, { summary, stats }))
    })
    .catch(err => this.error(err))
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
