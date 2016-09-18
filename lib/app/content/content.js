import request from 'request'
import file from '../file'
import analyze from './analyze'

function Model () {
  this.state = 'loading'
}

function loading () {
  return this.state === 'loading'
}

function error (err) {
  this.state = 'error'
  this.error = err
  console.error(err)
}

function created () {
  request(this.src, (err, res, body) => {
    if (err) return this.error(err)
    analyze(body, (err, results) => {
      if (err) this.error(err)
      this.title = results.title
      this.paragraphs = results.paragraphs
      this.meta = results.meta
      this.state = 'loaded'
    })
  })
}

export default {
  template: file(__dirname, 'content.html'),
  props: [ 'src' ],
  data: () => new Model(),
  methods: {
    error
  },
  computed: {
    loading
  },
  events: {
    'hook:created': created
  }
}
