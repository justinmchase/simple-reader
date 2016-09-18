import file from '../file'
import request from 'request'

const title = /<title[^>]*>(.+?)<\/title>/
const h1 = /<h1[^>]*>(.+?)<\/h1>/
const ps = /<p>(.+?)<\/p>/g
const tags = /<[^>]*>/g


function Model () {
  this.state = 'loading'
}

function loading () {
  return this.state === 'loading'
}

function created () {
  request(this.src, (err, res, body) => {
    if (err) {
      this.state = 'error'
      this.error = err
      return console.log(err)
    }

    let match = body.match(title)
    if (match) {
      this.title = match[1].replace(tags, '')
    }

    match = body.match(h1)
    if (match) {
      this.headline = match[1].replace(tags, '')
    }

    match = body.match(ps)
    this.paragraphs = match ? match.map(p => p.replace(tags, '')) : []

    this.state = 'loaded'
  })
}

export default {
  template: file(__dirname, 'content.html'),
  props: [ 'src' ],
  data: () => new Model(),
  computed: {
    loading
  },
  events: {
    'hook:created': created
  }
}
