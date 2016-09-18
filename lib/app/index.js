import Vue from 'vue'
import { ipcRenderer } from 'electron'
import app from './app'

let $vm = null
ipcRenderer.on('url', (event, url) => {
  $vm.$broadcast('new-url', url)
})

window.addEventListener('DOMContentLoaded', () => {
  $vm = new Vue({
    el: 'body',
    components: {
      app
    }
  })
})
