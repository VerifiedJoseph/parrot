import { Helper } from './Helper.js'
import { Dom } from './Dom.js'

export class Filter {
  /**
   * Filter tweets
   * @param {array} data
   */
  static run (data) {
    const users = [] // Usernames of tweets filtered

    const userFilter = document.getElementById('username-filter').value
    const mediaFilter = document.getElementById('media-filter').value
    const search = document.getElementById('search-input').value

    const elements = document.querySelectorAll('div.tweet')
    elements.forEach(function (element) {
      element.classList.add('hide')
    })

    const filtered = data.tweets.filter(function (tweet) {
      if (userFilter !== 'all' && tweet.username !== userFilter) {
        return false
      }

      if (search !== '' && tweet.text.search(search.trim()) === -1) {
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

      if (users.includes(tweet.username) === false) {
        users.push(tweet.username)
      }

      const element = document.querySelector(`div[data-id="${tweet.id}"]`)
      element.classList.remove('hide')

      return true
    })

    Dom.innerText('filter-number', Helper.formatNumber(filtered.length))

    let name = userFilter
    if (userFilter !== 'none') {
      if (userFilter === 'all') {
        name = `${Helper.formatNumber(users.length)} users`
      }

      if (search !== '') {
        name += ` containing "${search}"`
      }

      Dom.innerText('filter-name', name)
    }
  }

  /**
   * Remove username options from user filter list
   */
  static clearUsernames () {
    const f = document.getElementById('username-filter')

    f.querySelectorAll('option').forEach(function (element, index) {
      if (index !== 0) {
        element.parentNode.removeChild(element)
      }
    })
  }

  /**
   * Reset filter to default option
   */
  static resetFilter (name) {
    document.getElementById(`${name}-filter`).getElementsByTagName('option')[0].selected = 'selected'
  }

  /**
   * Clear query from search box
   */
  static clearSearch () {
    document.getElementById('search-input').value = ''
  }

  /**
   * Reset filters to default state
   */
  static resetState () {
    Filter.clearUsernames()
    Filter.clearSearch()
    Filter.resetFilter('username')
    Filter.resetFilter('media')
  }
}
