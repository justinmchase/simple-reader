
const title = /<title[^>]*>(.+?)<\/title>/i
const pTags = /<p[^>]*>((.|\n)+?)<\/p>/gi
const tags = /<[^>]*>/g

const metaTags = /<meta[^>]*>/gi
const metaContent = /content="([^"]*)"/i
const metaNames = {
  'title': /name="title"/i,
  'copyright': /name="copyright"/i,
  'keywords': /name="keywords"/i,
  'news_keywords': /name="news_keywords"/i,
  'description': /name="description"/i,
  'abstract': /name="abstract"/i,
  'original-source': /name="original-source"/i,
  'author': /name="author"/i,
  'owner': /name="owner"/i,

  'Section': /name="Section"/i,
  'Subsection': /name="Subsection"/i,
  'Author': /name="Author"/i,
  'DisplayDate': /name="DisplayDate"/i,
  'ExpiryDate': /name="ExpiryDate"/i,

  'og:title': /property="og:title"/i,
  'og:type': /property="og:type"/i,
  'og:url': /property="og:url"/i,
  'og:description': /property="og:description"/i,
  'og:image': /property="og:image"/i,
  'og:image:width': /property="og:image:width"/i,
  'og:image:height': /property="og:image:height"/i,
  'og:site_name': /property="og:site_name"/i,
  'og:updated_time': /property="og:updated_time"/i,
  'og:locale': /property="og:locale"/i

  // article:publisher
  // article:published_time
  // article:modified_time
  // article:section
}

export default function analyze (body, callback) {
  let results = { meta: { all: [] } }
  let match = body.match(title)
  if (match) {
    results.title = match[1].replace(tags, '')
  }

  match = body.match(pTags)
  results.paragraphs = match ? match.map(p => p.replace(tags, '')) : []

  match = body.match(metaTags)
  for (let m of match || []) {
    for (let p in metaNames) {
      if (m.match(metaNames[p])) {
        let content = m.match(metaContent)
        if (content) {
          results.meta[p] = content[1]
          results.meta.all.push({ name: p, content: content[1] })
        }
        break
      }
    }
  }

  callback(null, results)
}
