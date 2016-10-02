
import file from '../file'

function Model () {
  this.addUrl = ''
}

function ready () {
  //
}

function read () {
  this.$dispatch('read-url', this.addUrl)
}

export default {
  template: file(__dirname, 'add.html'),
  props: [ 'item' ],
  data: () => new Model(),
  methods: {
    read
  },
  computed: {
  },
  events: {
    'hook:ready': ready
  }
}
