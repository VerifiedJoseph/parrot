export const Helper = {
  /**
   * Get the array index for a Tweet via its ID
   */
  getTweetIndex: function (id, tweets) {
    const check = (element) => element.id === id
    return tweets.findIndex(check)
  },

  /**
   * Get the array index for a User via its username
   */
  getUserIndex: function (username, users) {
    const check = (element) => element.username === username
    return users.findIndex(check)
  },

  /**
   * Extract tweet ID from tweet URL
   *
   * @param {string} url
   * @return Tweet ID
   */
  getIdFromUrl: function (url) {
    const regex = /https?:\/\/twitter\.com\/\w+\/status\/([0-9]+)/
    const id = url.match(regex)
    return id[1]
  },

  /**
   * Format a number
   *
   * @param {*} number
   * @returns
   */
  formatNumber: function (number) {
    return new Intl.NumberFormat().format(number)
  }
}
