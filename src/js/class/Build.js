import { Helper } from './Helper.js'
import { Dom } from './Dom.js'
import { Tweet } from './Tweet.js'

/**
 * Build page and its parts
 */
export class Build {
  /**
   * Build page
   * @param {array} data
   * @param {object} zip JSZip object
   * @param {bool} autoload Media autoload status
   */
  page (data, zip, autoload) {
    this.#tweets(data.tweets, zip, autoload)
    this.#filterList(data.users)

    Dom.innerText('filter-number', Helper.formatNumber(data.stats.tweets))
    Dom.innerText('filter-name', `${Helper.formatNumber(data.stats.users)} users`)

    Dom.show('filter-text')
    Dom.show('tweets')
  }

  /**
   * Build username filter list
   * @param {array} users
   */
  #filterList (users) {
    const select = document.getElementById('username-filter')
    const button = document.getElementById('username-filter-reset')
    let opt

    users.forEach(user => {
      opt = document.createElement('option')
      opt.value = user.username
      opt.innerText = `${user.display_name} (${user.username}) - ${Helper.formatNumber(user.tweets)} tweets`

      select.appendChild(opt)
    })

    select.disabled = false
    button.disabled = false
  }

  /**
   * Build tweets
   * @param {array} tweets
   * @param {object} zip JSZip object
   * @param {bool} autoload Media autoload status
   */
  #tweets (tweets, zip, autoload) {
    const items = document.getElementById('tweets')
    items.innerHTML = ''

    tweets.forEach(tweet => {
      const item = new Tweet(
        tweet, zip, autoload
      )

      items.appendChild(item.build())
    })
  }
}
