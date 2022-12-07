import { Helper } from './Helper.js'
import { Dom } from './Dom.js'
import { Tweet } from './Tweet.js'

/**
 * Build page and its parts
 */
export const Build = {
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

    Dom.innerText('filter-number', Helper.formatNumber(data.stats.tweets))
    Dom.innerText('filter-name', `${Helper.formatNumber(data.stats.users)} users`)

    Dom.show('filter-text')
    Dom.show('tweets')
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
      opt.innerText = `${user.display_name} (${user.username}) - ${Helper.formatNumber(user.tweets)} tweets`

      select.appendChild(opt)
    })

    select.disabled = false
    button.disabled = false
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
      const item = new Tweet(
        tweet, zip, autoload
      )

      items.appendChild(item.build())
    })
  }
}
