const { ipcRenderer } = require('electron')
const { summarize } = require('node-summary')

function getBody () {
  // let paragraphs = Array.prototype
  //   .slice
  //   .call(document.querySelectorAll('p'), 0)
  //   .map(p => p.innerText)

  // return [...new Set(paragraphs)]

  return document.body.innerText
}

function getTitle () {
  let titleTag = document.querySelector('title')
  let titleMeta = document.querySelector('meta[name="title"]')
  let ogTitle = document.querySelector('meta[property="og:title"]')
  return ogTitle && ogTitle.content
    ? ogTitle.content
    : titleMeta && titleMeta.content
    ? titleMeta.content
    : titleTag && titleTag.innerText
    ? titleTag.innerText
    : '<unknown>'
}

function getUrl () {
  let siteName = document.querySelector('meta[property="og:url"]')
  return siteName && siteName.content
}

function getSiteName () {
  let siteName = document.querySelector('meta[property="og:site_name"]')
  return siteName && siteName.content
}

function getSections () {
  let sections = []
  let section = document.querySelector('meta[name="Section"]')
  let subsection = document.querySelector('meta[name="Subsection"]')
  if (section && section.content) sections.push(section.content)
  if (subsection && subsection.content) sections.push(section.content)
  return sections
}

function getType () {
  let type = document.querySelector('meta[property="og:type"]')
  return type && type.content
}

function getAuthors () {
  let authors = []
  let author = document.querySelector('meta[name="author"]')
  let Author = document.querySelector('meta[name="Section"]')
  let owner = document.querySelector('meta[name="owner"]')
  if (author && author.content) authors.push(author.content)
  if (Author && Author.content) authors.push(Author.content)
  if (owner && owner.content) authors.push(owner.content)
  return authors
}

function getDate () {
  let displayDate = document.querySelector('meta[name="DisplayDate"]')
  let updatedTime = document.querySelector('meta[property="og:updated_time"]')
  let publishedTime = document.querySelector('meta[property="og:article:published_time"]')
  return {
    updated: updatedTime && updatedTime.content,
    display: displayDate && displayDate.content,
    published: publishedTime && publishedTime.content
  }
}

function getDescription () {
  let description = document.querySelector('meta[name="description"]')
  let og = document.querySelector('meta[property="og:description"]')
  return og && og.content || description && description.content
}

function getAbstract () {
  let abstract = document.querySelector('meta[name="abstract"]')
  return abstract && abstract.content
}

function getImage () {
  let image = document.querySelector('meta[property="og:image"]')
  let thumb = document.querySelector('meta[name="thumbnail"]')
  return image && image.content
    ? image.content
    : thumb && thumb.content
}

function getKeywords () {
  let k1 = document.querySelector('meta[name="keywords"]')
  let k2 = document.querySelector('meta[name="news_keywords"]')

  if (k1 && k1.content) {
    k1 = k1
      .content
      .split(',')
      .map(k => k.trim())
      .map(k => k.toLowerCase())
  } else {
    k1 = []
  }

  if (k2 && k2.content) {
    k2 = k2
      .content
      .split(',')
      .map(k => k.trim())
      .map(k => k.toLowerCase())
  } else {
    k2 = []
  }

  return [...new Set(k1.concat(k2))]
}

ipcRenderer.on('analysis-start', () => {
  console.log('analysis started...')
  let body = getBody()
  let title = getTitle()
  let url = getUrl()
  let siteName = getSiteName()
  let sections = getSections()
  let type = getType()
  let authors = getAuthors()
  let date = getDate()
  let description = getDescription()
  let abstract = getAbstract()
  let image = getImage()
  let keywords = getKeywords()

  console.log('summarizing...', body)
  summarize(title, body, (err, summary) => {
    console.log('sending...')
    if (err) {
      ipcRenderer.sendToHost('analysis-error', err)
    } else {
      ipcRenderer.sendToHost('analysis-results', {
        body,
        title,
        url,
        siteName,
        sections,
        type,
        authors,
        date,
        description,
        abstract,
        image,
        keywords,
        summary
      })
    }
  })
})
