/**
 * Control DOM elements
 */
export const Dom = {
  /**
   * Display error message
   * @param {string} text
   */
  displayError: function (text) {
    this.innerText('error', text)
    this.show('error')
  },

  /**
   * Hide error message
   */
  hideError: function () {
    this.innerText('error', '')
    this.hide('error')
  },

  /**
   * Clear tweets
   */
  clearTweets: function () {
    this.hide('tweets')
    this.innerText('tweets', '')
  },

  /**
   * Show an element
   * @param {string} element Element id
   */
  show: function (element) {
    document.getElementById(element).classList.remove('hide')
  },

  /**
   * Hide an element
   * @param {string} element Element id
   */
  hide: function (element) {
    document.getElementById(element).classList.add('hide')
  },

  /**
   * Enable an input
   * @param {string} element Element id
   */
  enableInput: function (element) {
    document.getElementById(element).disabled = false
  },

  /**
   * Disable an input
   * @param {string} element Element id
   */
  disableInput: function (element) {
    document.getElementById(element).disabled = true
  },

  /**
   * Set inner text for element
   * @param {string} element Element id
   * @param {string} text Text
   */
  innerText: function (element, text) {
    document.getElementById(element).innerText = text
  },

  /**
   * Set title for element
   * @param {string} element Element id
   * @param {string} text Text
   */
  title: function (element, text) {
    document.getElementById(element).title = text
  }
}
