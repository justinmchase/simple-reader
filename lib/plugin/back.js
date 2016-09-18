/* globals chrome */

var protocol = 'raw-reader://'
var protocolS = 'raw-reader-s://'

function removeTab (tab) {
  if (tab.url.indexOf(protocol) === 0 || tab.url.indexOf(protocolS) === 0) {
    // setTimeout(function () {
    //   chrome.tabs.remove(tab.id)
    // }, 3000)
  }
}

chrome.tabs.onCreated.addListener(function (tab) {
  removeTab(tab)
})
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  removeTab(tab)
})

chrome.contextMenus.create({
  title: 'Open in Raw Reader',
  contexts: ['link'],
  onclick: function (info, tab) {
    var opts = {
      index: tab.index + 1,
      url: info
        .linkUrl
        .replace('http://', protocol)
        .replace('https://', protocolS)
    }
    chrome.tabs.create(opts)
  }
})
