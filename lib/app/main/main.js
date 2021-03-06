import uuid from 'uuid'
import file from '../file'
import content from '../content/content'
import add from '../add/add'

function Model () {
  this.message = 'Hello World?'
  this.items = []
  this.focus = focus
}

function newUrl (url) {
  let id = uuid.v4()
  let title = 'New Tab'
  let item = {
    id,
    url,
    title,
    active: false
  }
  this.items.push(item)
  this.focus(id)
}

function focus (id) {
  setTimeout(() => window
    .jQuery(`#tabs a[href="#${id}"]`)
    .tab('show'),
    0)
}

function close (item) {
  let i = this.items.indexOf(item)
  this.items.splice(i, 1)

  i = Math.min(this.items.length - 1, i)
  if (i >= 0) this.focus(this.items[i].id)
  else this.focus('add')
}

function read (url) {
  this.newUrl(url)
}

export default {
  template: file(__dirname, 'main.html'),
  data: () => new Model(),
  methods: {
    newUrl,
    close,
    read
  },
  components: {
    content,
    add
  },
  events: {
    'read-url': read,
    'new-url': newUrl
  }
}
