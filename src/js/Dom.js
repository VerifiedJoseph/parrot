/**
 * Control DOM elements
 */
export class Dom {
  /**
   * Display error message
   * @param {string} text
   */
  static displayError (text) {
    this.innerText('error', text)
    this.show('error')
  }

  /**
   * Hide error message
   */
  static hideError () {
    this.innerText('error', '')
    this.hide('error')
  }

  /**
   * Clear tweets
   */
  static clearTweets () {
    this.hide('tweets')
    this.innerText('tweets', '')
  }

  /**
   * Show an element
   * @param {string} element Element id
   */
  static show (element) {
    document.getElementById(element).classList.remove('hide')
  }

  /**
   * Hide an element
   * @param {string} element Element id
   */
  static hide (element) {
    document.getElementById(element).classList.add('hide')
  }

  /**
   * Enable an input
   * @param {string} element Element id
   */
  static enableInput (element) {
    document.getElementById(element).disabled = false
  }

  /**
   * Disable an input
   * @param {string} element Element id
   */
  static disableInput (element) {
    document.getElementById(element).disabled = true
  }

  /**
   * Set inner text for element
   * @param {string} element Element id
   * @param {string} text Text
   */
  static innerText (element, text) {
    document.getElementById(element).innerText = text
  }

  /**
   * Set title for element
   * @param {string} element Element id
   * @param {string} text Text
   */
  static title (element, text) {
    document.getElementById(element).title = text
  }
}
