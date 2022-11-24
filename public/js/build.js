/* global Autolinker, dom, helper */

const build = { // eslint-disable-line no-unused-vars
  /**
   * Build page
   *
   * @param {array} data
   * @param {*} zip
   * @param {bool} autoload Media autoload status
   */
  page: function (data, zip, autoload) {
    this.tweets(data.tweets, zip, autoload)
    this.filterList(data.users)

    dom.innerText('username-filter-number', helper.formatNumber(data.stats.tweets))
    dom.innerText('username-filter-name', helper.formatNumber(data.stats.users) + ' users')

    dom.show('username-filter-text')
    dom.show('tweets')
  },

  /**
   * Build username filter list
   *
   * @param {array} users
   */
  filterList: function (users) {
    const select = document.getElementById('username-filter')
    const button = document.getElementById('username-filter-reset')
    let opt

    users.forEach(user => {
      opt = document.createElement('option')
      opt.value = user.username
      opt.innerText = `${user.display_name} (${user.username}) - ${helper.formatNumber(user.tweets)} tweets`

      select.appendChild(opt)
    })

    select.disabled = false
    button.disabled = false
  },

  /**
   * Build links in tweet body
   *
   * @param {string} text
   * @returns
   */
  links: function (text) {
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
  },

  /**
   * Build tweets
   *
   * @param {array} tweets
   * @param {*} zip
   * @param {bool} autoload Media autoload status
   */
  tweets: function (tweets, zip, autoload) {
    const items = document.getElementById('tweets')
    items.innerHTML = ''

    document.getElementById('tweets')

    tweets.forEach(tweet => {
      const item = document.createElement('div')
      item.classList.add('tweet')
      item.setAttribute('data-username', tweet.username)
      item.setAttribute('data-id', tweet.id)
      item.setAttribute('data-timestamp', tweet.date)

      const header = document.createElement('div')
      header.classList.add('header')

      const body = document.createElement('div')
      body.classList.add('body')
      body.innerHTML = this.links(tweet.text)

      const stats = document.createElement('div')
      stats.classList.add('stats')
      stats.innerText = `${helper.formatNumber(tweet.stats.replies)} Replies - 
        ${helper.formatNumber(tweet.stats.retweets)} Retweets - ${helper.formatNumber(tweet.stats.likes)} Likes`

      const name = document.createElement('div')
      name.classList.add('name')

      const nameLink = document.createElement('a')
      nameLink.innerText = tweet.display_name
      nameLink.setAttribute('href', 'https://twitter.com/' + tweet.username)
      nameLink.setAttribute('target', '_blank')
      name.appendChild(nameLink)

      const username = document.createElement('div')
      username.classList.add('username')
      username.innerText = tweet.username

      const br = document.createElement('br')

      name.appendChild(br)
      name.appendChild(username)

      const date = document.createElement('div')
      date.classList.add('date')

      const dateLink = document.createElement('a')
      dateLink.innerText = tweet.date
      dateLink.setAttribute('href', tweet.url)
      dateLink.setAttribute('target', '_blank')

      date.appendChild(dateLink)

      const clear = document.createElement('div')
      clear.classList.add('clear')

      header.appendChild(name)
      header.appendChild(date)
      header.appendChild(clear)

      item.appendChild(header)
      item.appendChild(body)

      if (tweet.media.length !== 0) {
        if (autoload === true) {
          item.appendChild(this.media(tweet.media, zip))
        } else {
          item.appendChild(this.mediaPlaceholder(tweet.id, tweet.stats))
        }
      }

      item.appendChild(stats)
      items.appendChild(item)
    })
  },

  /**
   * Build media placeholder for a tweet
   *
   * @param {string} tweetId Tweet ID
   * @param {object} stats Tweet stats
   * @returns
   */
  mediaPlaceholder: function (id, stats) {
    const placeholder = document.createElement('button')
    placeholder.classList.add('placeholder')
    placeholder.setAttribute('data-tweet-id', id)

    let text = 'Load media '

    if (stats.images > 0) {
      let word = ' images'

      if (stats.images === 1) {
        word = ' image'
      }

      text += '(' + stats.images + word + ')'
    }

    if (stats.videos > 0) {
      let word = ' videos'

      if (stats.videos === 1) {
        word = ' video'
      }

      text += '(' + stats.videos + word + ')'
    }

    placeholder.innerText = text

    return placeholder
  },

  /**
   * Build media for a tweet
   *
   * @param {array} items Media items
   * @param {*} zip
   * @returns
   */
  media: function (items, zip) {
    const media = document.createElement('div')
    media.classList.add('media')

    const gallery = document.createElement('div')
    gallery.classList.add('gallery')

    items.forEach(item => {
      if (zip.file(item.filename) !== null) {
        zip.file(item.filename)
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
          })

        media.appendChild(gallery)
      } else {
        console.log(`file not found: ${item.filename}`)

        media.appendChild(this.mediaError(item.filename))
      }
    })

    return media
  },

  /**
   * Build media file error
   *
   * @param {string} filename Media filename
   * @returns
   */
  mediaError: function (filename) {
    const error = document.createElement('div')
    error.classList.add('error')
    error.innerText = `File not found: ${filename}`

    return error
  }
}
