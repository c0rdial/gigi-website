// Fills each page from Sanity (project 6nir8wjj), so Gigi edits content in the Studio and never needs a redeploy.
// Pages hold empty [data-cms] containers; <body data-page> says which content to fetch.
import {toHTML} from './portabletext-to-html.js'

const PROJECT = '6nir8wjj'
const DATASET = 'production'
const API = `https://${PROJECT}.apicdn.sanity.io/v2025-02-19/data/query/${DATASET}`

async function query(groq, params = {}) {
  const url = new URL(API)
  url.searchParams.set('query', groq)
  for (const [name, value] of Object.entries(params)) url.searchParams.set(`$${name}`, JSON.stringify(value))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity query failed (${res.status}): ${groq}`)
  return (await res.json()).result
}

// Asset refs look like image-<id>-<w>x<h>-<ext>; the CDN resizes, so phones never download the original upload.
function imageUrl(image, width) {
  const [, id, size, ext] = image.asset._ref.split('-')
  return `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${id}-${size}.${ext}?w=${width}&fit=max&auto=format`
}

const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const text = (blocks) => (blocks ? toHTML(blocks) : '')
// The Studio validates links too, but the API can be written to directly, so the page refuses script URLs itself.
function safeUrl(url) {
  try {
    return ['http:', 'https:', 'mailto:'].includes(new URL(url, location.href).protocol) ? url : '#'
  } catch {
    return '#'
  }
}
const safeHref = (url) => esc(safeUrl(url ?? '#'))

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
// Sanity dates are plain YYYY-MM-DD; splitting avoids Date's UTC shift.
const dateParts = (date) => date.split('-').map(Number)
const shortDate = (date) => {
  const [y, m, d] = dateParts(date)
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`
}
const longDate = (date) => {
  const [y, m, d] = dateParts(date)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

function fill(name, html) {
  const el = document.querySelector(`[data-cms="${name}"]`)
  if (!el) throw new Error(`Missing [data-cms="${name}"] on this page`)
  el.innerHTML = html
  return el
}

const SIDEBAR = `"sidebar": *[_id == "profile"][0]{picture, age, country}`

function renderSidebar({picture, age, country}) {
  for (const img of document.querySelectorAll('[data-cms="sidebarPicture"]')) img.src = imageUrl(picture, 400)
  const meta = document.querySelector('[data-cms="sidebarMeta"]')
  if (meta) meta.innerHTML = `Age: ${esc(age)}<br>Location: ${esc(country)}`
}

const pages = {
  async profile() {
    const {profile, latest} = await query(`{
      "profile": *[_id == "profile"][0],
      "latest": *[_type == "post"] | order(date desc)[0...5]{title, "slug": slug.current}
    }`)
    fill('name', esc(profile.name))
    const picture = document.querySelector('[data-cms="picture"]')
    picture.src = imageUrl(profile.picture, 400)
    picture.alt = `${profile.name}'s picture`
    fill('headline', esc(profile.headline))
    fill('info', [`${profile.age} years old`, profile.gender, `${profile.city},`, profile.country.toUpperCase()]
      .map((line) => `<li>${esc(line)}</li>`).join(''))
    fill('lastLogin', profile.lastLogin ? shortDate(profile.lastLogin) : '')
    fill('interests', (profile.interests ?? []).map(({category, text: body}) => `
      <tr><th class="sidebar-table-header" scope="row">${esc(category)}</th>
      <td class="sidebar-table-data">${text(body)}</td></tr>`).join(''))
    fill('details', (profile.details ?? []).map(({label, value}) => `
      <tr><th class="sidebar-table-header" scope="row">${esc(label)}:</th>
      <td class="sidebar-table-data">${esc(value)}</td></tr>`).join(''))
    fill('latestPosts', latest.map(({title, slug}) =>
      `<p>${esc(title)} (<a href="entry.html?post=${encodeURIComponent(slug)}">view more</a>)</p>`).join(''))
    fill('aboutMe', text(profile.aboutMe))
    fill('whoIdLikeToMeet', text(profile.whoIdLikeToMeet))
    fill('friendCount', esc(profile.friendCount))
    fill('topFriends', (profile.topFriends ?? []).map(({name, url, photo}) => `
      <figure>
        <figcaption><a href="${safeHref(url)}">${esc(name)}</a></figcaption><a href="${safeHref(url)}"><img src="${imageUrl(photo, 300)}" alt="${esc(name)}"/></a>
      </figure>`).join(''))
  },

  async blog() {
    const {sidebar, posts} = await query(`{
      ${SIDEBAR},
      "posts": *[_type == "post"] | order(date desc){title, "slug": slug.current, date, category, commentCount, summary}
    }`)
    renderSidebar(sidebar)
    fill('posts', posts.map((post) => {
      const href = `entry.html?post=${encodeURIComponent(post.slug)}`
      return `
      <article class="blog-entry">
        <header class="entry-header">
          <div class="entry-meta">Date: ${longDate(post.date)} — ${esc(post.commentCount ?? 0)} Comments</div>
          <h3 class="entry-title"><a href="${href}">${esc(post.title)}</a></h3>
          ${post.category ? `<div class="entry-category">Category: ${esc(post.category)}</div>` : ''}
        </header>
        <div class="entry-body">
          ${text(post.summary)}
          <p><a href="${href}">continue reading...</a></p>
        </div>
      </article>`
    }).join(''))
  },

  async entry() {
    const slug = document.body.dataset.post ?? new URLSearchParams(location.search).get('post')
    const {sidebar, post} = await query(`{
      ${SIDEBAR},
      "post": *[_type == "post" && slug.current == $slug][0]
    }`, {slug})
    renderSidebar(sidebar)
    if (!post) {
      document.title = "Blog entry not found | Gigi's Blog"
      fill('title', 'Blog entry not found')
      return
    }
    document.title = `${post.title} | Gigi's Blog`
    fill('title', esc(post.title))
    fill('published', `published ${longDate(post.date)}`)
    fill('category', esc(post.category ?? ''))
    fill('body', text(post.body) + (post.top8Lists ?? []).map((list) => `
      <div class="friend-category-wrapper">
        <h1 class="friend-grid-title">${esc(list.title)}</h1>
        ${list.updated ? `<h3 class="friend-grid-subtitle"><b>Last</b> updated <span class="friend-count">${shortDate(list.updated)}</span></h3>` : ''}
        <div class="friend-list-container">
          ${(list.items ?? []).map((item) => `
          <div class="friend-cell">
            <h4><a href="${safeHref(item.url)}">${esc(item.title)}</a></h4>
            <a class="friend-photo-link" href="${safeHref(item.url)}"><img src="${imageUrl(item.image, 300)}" alt="${esc(item.image.alt ?? item.title)}"/></a>
            ${item.subtitle ? `<p><a href="${safeHref(item.subtitleUrl ?? item.url)}"><i>${esc(item.subtitle)}</i></a></p>` : ''}
          </div>`).join('')}
        </div>
      </div>`).join(''))
  },

  async gallery() {
    const {sidebar, albums} = await query(`{
      ${SIDEBAR},
      "albums": *[_type == "album"] | order(date desc){title, "slug": slug.current, cover}
    }`)
    renderSidebar(sidebar)
    fill('albums', albums.map(({title, slug, cover}) => {
      const href = `album.html?shoot=${encodeURIComponent(slug)}`
      return `
      <article class="album-card">
        <header class="album-card-header"><a href="${href}">${esc(slug)}</a></header>
        <div class="album-card-body">
          <img src="${imageUrl(cover, 400)}" alt="${esc(title)} cover image"/>
          <a href="${href}" class="view-pics-btn">[view entry]</a>
        </div>
      </article>`
    }).join(''))
  },

  async album() {
    const slug = new URLSearchParams(location.search).get('shoot')
    const {sidebar, album} = await query(`{
      ${SIDEBAR},
      "album": *[_type == "album" && slug.current == $slug][0]{title, photos}
    }`, {slug})
    renderSidebar(sidebar)
    if (!album) {
      fill('albumTitle', 'Album Not Found Entry')
      return
    }
    fill('albumTitle', esc(album.title))
    fill('slides', (album.photos ?? []).map((photo) => `
      <div class="swiper-slide"><img src="${imageUrl(photo, 1200)}" alt="${esc(photo.alt ?? '')}"/></div>`).join(''))
    // Swiper is loaded as a classic script before this module, so the global exists by now.
    new Swiper('.swiper', {
      loop: true,
      effect: 'fade', // Smooth vintage crossfade animation look
      speed: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300,
      fadeEffect: {crossFade: true},
      pagination: {el: '.swiper-pagination', clickable: true},
      navigation: {nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'},
      keyboard: {enabled: true},
    })
  },
}

// Runs apart from the page's content: if it fails, the links already in the HTML still work.
async function renderNavigation() {
  const nav = await query(`*[_id == "navigation"][0]`)
  const links = (list) => list.map(({label, url}) => `<li><a href="${safeHref(url)}">${esc(label)}</a></li>`).join('')
  if (nav?.contactButtons) renderContactButtons(nav.contactButtons)
  if (nav?.topLeft) document.querySelector('.topnav.home').innerHTML = links(nav.topLeft)
  if (nav?.menu) document.querySelector('.navbar ul').innerHTML = links(nav.menu)
  if (nav?.footer) {
    document.querySelector('.footer ul').innerHTML = links(nav.footer)
    // The stylesheet drops the separator after the final footer link by this id
    document.querySelector('.footer li:last-child')?.setAttribute('id', 'last')
  }
  if (nav?.topRight) {
    // theme.js keeps its picker in this list, so only the links are swapped
    const list = document.querySelector('.topnav.signup')
    for (const item of list.querySelectorAll('li:has(> a)')) item.remove()
    list.insertAdjacentHTML('afterbegin', links(nav.topRight))
  }
}

// Separate anchors, not a list: each button keeps its own GIF, so only its destination is editable.
function renderContactButtons(buttons) {
  for (const anchor of document.querySelectorAll('[data-contact]')) {
    const url = buttons[anchor.dataset.contact]
    if (url && safeUrl(url) !== '#') {
      anchor.href = url
      if (url.startsWith('mailto:')) anchor.removeAttribute('target')
      else anchor.target = '_blank'
      anchor.rel = 'noopener'
    } else {
      anchor.removeAttribute('href')
      anchor.removeAttribute('target')
    }
  }
}
renderNavigation().catch((error) => console.error('Navigation not loaded from Sanity:', error))

const status = document.querySelector('[data-cms="status"]')
try {
  await pages[document.body.dataset.page]()
  status?.remove()
} catch (error) {
  if (status) status.textContent = "Sorry, this page couldn't load. Please refresh to try again."
  throw error
}
