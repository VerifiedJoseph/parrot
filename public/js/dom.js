function displayError (text) {
  innerText('error', text)
  show('error')
}

function hideError () {
  innerText('error', '')
  hide('error')
}

function clearTweets () {
  hide('tweets')
  innerText('tweets', '')
}

function show (element) {
  document.getElementById(element).classList.remove('hide')
}

function hide (element) {
  document.getElementById(element).classList.add('hide')
}

function disableInput (element) {
  document.getElementById(element).disabled = true
}

function enableInput (element) {
  document.getElementById(element).disabled = false
}

function innerText (element, text) {
  document.getElementById(element).innerText = text
}
