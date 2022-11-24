function buildPage (data, zip, autoload) {
  buildTweets(data.tweets, zip, autoload)
  buildFilterList(data.users)

  innerText('username-filter-number', formatNumber(data.stats.tweets))
  innerText('username-filter-name', formatNumber(data.stats.users) + ' users')

  show('username-filter-text')
  show('tweets')
}

function buildFilterList (users) {
  const select = document.getElementById('username-filter')
  const button = document.getElementById('username-filter-reset')
  let opt

  users.forEach(user => {
    opt = document.createElement('option')
    opt.value = user.username
    opt.innerText = user.display_name + ' (' + user.username + ') - ' +
                formatNumber(user.tweets) + ' tweets'

    select.appendChild(opt)
  })

  select.disabled = false
  button.disabled = false
}

function buildLinks (text) {
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

function buildTweets (tweets, zip, autoload) {
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
    body.innerHTML = buildLinks(tweet.text)

    const stats = document.createElement('div')
    stats.classList.add('stats')
    stats.innerText = formatNumber(tweet.stats.replies) + ' Replies - ' +
            formatNumber(tweet.stats.retweets) + ' Retweets - ' +
            formatNumber(tweet.stats.likes) + ' Likes'

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
        item.appendChild(buildMedia(tweet.media, zip))
      } else {
        item.appendChild(buildMediaPlaceholder(tweet.id, tweet.stats))
      }
    }

    item.appendChild(stats)
    items.appendChild(item)
  })
}

function buildMediaPlaceholder (tweetId, stats) {
  const placeholder = document.createElement('button')
  placeholder.classList.add('placeholder')
  placeholder.setAttribute('data-tweet-id', tweetId)

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
}

function buildMedia (items, zip) {
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
      console.log('file not found: ' + item.filename)

      media.appendChild(buildMediaError(item.filename))
    }
  })

  return media
}

function buildMediaError (filename) {
  const error = document.createElement('div')
  error.classList.add('error')
  error.innerText = 'File not found: ' + filename

  return error
}
