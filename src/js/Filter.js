import { Helper } from './Helper.js'
import { Dom } from './Dom.js'

export const Filter = {
  /**
   * Filter tweets
   *
   * @param {array} data
   */
  run: function (data) {
    const userFilter = document.getElementById('username-filter').value
    const mediaFilter = document.getElementById('media-filter').value

    const elements = document.querySelectorAll('div.tweet')
    elements.forEach(function (element) {
      element.classList.add('hide')
    })

    const filtered = data.tweets.filter(function (tweet) {
      if (userFilter !== 'all' && tweet.username !== userFilter) {
        return false
      }

      if (mediaFilter !== 'all') {
        switch (mediaFilter) {
          case 'none':
            if (tweet.media.length > 0) {
              return false
            }
            break
          case 'videos':
            if (tweet.stats.videos === 0) {
              return false
            }
            break
          default:
            if (tweet.stats.images === 0) {
              return false
            }
            break
        }
      }

      const element = document.querySelector('div[data-id="' + tweet.id + '"]')
      element.classList.remove('hide')

      return true
    })

    Dom.innerText('username-filter-number', Helper.formatNumber(filtered.length))

    let name = userFilter
    if (userFilter !== 'none') {
      if (userFilter === 'all') {
        name = Helper.formatNumber(data.stats.users) + ' users'
      }

      Dom.innerText('username-filter-name', name)
    }
  },

  /**
   * Remove username options from user filter list
   */
  clearUsernames: function () {
    const f = document.getElementById('username-filter')

    f.querySelectorAll('option').forEach(function (element, index) {
      if (index !== 0) {
        element.parentNode.removeChild(element)
      }
    })

    f.getElementsByTagName('option')[0].selected = 'selected'
  }
}
