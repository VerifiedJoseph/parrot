import Autolinker from 'autolinker'

import { Helper } from './Helper.js'

/**
 * Build a tweet
 */
export class Tweet {
  /**
   * @param {object} tweet Tweet data
   * @param {*} zip Zip file
   * @param {bool} loadMedia Load media status
   */
  constructor (tweet, zip, loadMedia = false) {
    this.tweet = tweet
    this.zip = zip
    this.loadMedia = loadMedia
  }

  /**
   * Build tweet
   */
  build () {
    const item = document.createElement('div')
    item.classList.add('tweet')
    item.setAttribute('data-username', this.tweet.username)
    item.setAttribute('data-id', this.tweet.id)
    item.setAttribute('data-timestamp', this.tweet.date)

    item.appendChild(this.header())
    item.appendChild(this.body())

    if (this.tweet.media.length !== 0) {
      if (this.loadMedia === true) {
        item.appendChild(this.media())
      } else {
        item.appendChild(this.mediaPlaceholder())
      }
    }

    item.appendChild(this.footer())

    return item
  }

  /**
   * Build tweet header
   */
  header () {
    const header = document.createElement('div')
    header.classList.add('header')

    const name = document.createElement('div')
    name.classList.add('name')

    const username = document.createElement('div')
    username.classList.add('username')
    username.innerText = this.tweet.username

    const nameLink = document.createElement('a')
    nameLink.innerText = this.tweet.display_name
    nameLink.setAttribute('href', `https://twitter.com/${this.tweet.username}`)
    nameLink.setAttribute('target', '_blank')
    name.appendChild(nameLink)
    name.appendChild(username)

    const date = document.createElement('div')
    date.classList.add('date')

    const dateLink = document.createElement('a')
    dateLink.innerText = this.tweet.date
    dateLink.setAttribute('href', this.tweet.url)
    dateLink.setAttribute('target', '_blank')

    date.appendChild(dateLink)

    const clear = document.createElement('div')
    clear.classList.add('clear')

    header.appendChild(name)
    header.appendChild(date)
    header.appendChild(clear)

    return header
  }

  /**
   * Build tweet body
   */
  body () {
    const body = document.createElement('div')
    body.classList.add('body')
    body.innerHTML = this.links(this.tweet.text)

    return body
  }

  /**
   * Build media
   */
  media () {
    const media = document.createElement('div')
    media.classList.add('media')

    const gallery = document.createElement('div')
    gallery.classList.add('gallery')

    this.tweet.media.forEach(item => {
      if (this.zip.file(item.filename) !== null) {
        this.zip.file(item.filename)
          .async('arraybuffer')
          .then(function (content) {
            const buffer = new Uint8Array(content)
            const blob = new Blob([buffer.buffer])
            const url = URL.createObjectURL(blob)

            let element
            if (item.type === 'Image') {
              const image = new Image()
              image.src = url
              image.setAttribute('loading', 'lazy')

              const a = document.createElement('a')
              a.setAttribute('href', url)
              a.setAttribute('target', '_blank')

              a.appendChild(image)

              element = a
            } else if (item.type === 'Video' || item.type === 'GIF') {
              const video = document.createElement('video')
              video.src = url
              video.controls = true

              if (item.type === 'GIF') {
                video.loop = true
                video.autoplay = true
              }

              element = video
            }

            const div = document.createElement('div')
            div.appendChild(element)

            gallery.appendChild(div)
          })
          .catch(function (err) {
            console.error(err)
            media.appendChild(this.mediaError(item.filename))
          })
          .finally(function () {
            media.appendChild(gallery)
          })
      } else {
        console.log(`file not found: ${item.filename}`)

        media.appendChild(this.mediaError(item.filename))
      }
    })

    return media
  }

  /**
   * Build media placeholder for tweet
   */
  mediaPlaceholder () {
    const placeholder = document.createElement('button')
    placeholder.classList.add('placeholder')
    placeholder.setAttribute('data-tweet-id', this.tweet.id)

    let text = 'Load media '

    if (this.tweet.stats.images > 0) {
      let word = ' images'

      if (this.tweet.stats.images === 1) {
        word = ' image'
      }

      text += `(${this.tweet.stats.images} ${word})`
    }

    if (this.tweet.stats.videos > 0) {
      let word = ' videos'

      if (this.tweet.stats.videos === 1) {
        word = ' video'
      }

      text += `(${this.tweet.stats.videos} ${word})`
    }

    placeholder.innerText = text

    return placeholder
  }

  /**
   * Build media file error
   *
   * @param {string} filename Media filename
   */
  mediaError (filename) {
    const error = document.createElement('div')
    error.classList.add('error')
    error.innerText = `File not found: ${filename}`

    return error
  }

  /**
   * Build footer
   */
  footer () {
    const replies = Helper.formatNumber(this.tweet.stats.replies)
    const retweets = Helper.formatNumber(this.tweet.stats.retweets)
    const likes = Helper.formatNumber(this.tweet.stats.likes)

    const stats = document.createElement('div')
    stats.classList.add('stats')
    stats.innerText = `${replies} Replies - ${retweets} Retweets - ${likes} Likes`

    return stats
  }

  /**
   * Build links for tweet text
   *
   * @param {string} text
   */
  links (text) {
    const autoLinker = new Autolinker({
      urls: {
        schemeMatches: true,
        tldMatches: true,
        ipV4Matches: true
      },
      email: true,
      mention: 'twitter',
      hashtag: 'twitter',
      stripPrefix: false,
      stripTrailingSlash: false,
      newWindow: true
    })

    return autoLinker.link(text)
  }
}
