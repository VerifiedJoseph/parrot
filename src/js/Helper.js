export const Helper = {
  /**
   * Get the array index for a Tweet via its identifier
   * @param {string} id
   * @param {object} Tweets
   * @returns {int} Array index for tweet
   */
  getTweetIndex: function (id, tweets) {
    const check = (element) => element.id === id
    return tweets.findIndex(check)
  },

  /**
   * Get the array index for a User via its username
   * @param {string} Username
   * @param {object} Users
   * @returns {int} Array index for user
   */
  getUserIndex: function (username, users) {
    const check = (element) => element.username === username
    return users.findIndex(check)
  },

  /**
   * Extract tweet identifier from tweet URL
   * @param {string} url
   * @returns {string} Tweet identifier
   */
  getIdFromUrl: function (url) {
    const regex = /https?:\/\/twitter\.com\/\w+\/status\/([0-9]+)/
    const id = url.match(regex)
    return id[1]
  },

  /**
   * Format a number
   * @param {(string|int)} number
   * @returns {string}
   */
  formatNumber: function (number) {
    return new Intl.NumberFormat().format(number)
  }
}
