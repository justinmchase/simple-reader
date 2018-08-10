/* globals chrome */

var protocol = 'reader://'

function removeTab (tab) {
  if (tab.url.indexOf(protocol) === 0) {
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
  title: 'Open in Simple Reader',
  contexts: ['link'],
  onclick: function (info, tab) {
    var opts = {
      index: tab.index + 1,
      url: `${protocol}${encodeURI(info.linkUrl)}`
    }
    chrome.tabs.create(opts)
  }
})
