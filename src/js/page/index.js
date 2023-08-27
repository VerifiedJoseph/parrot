import JSZip from 'jszip'

import { Helper } from '../Helper.js'
import { Csv } from '../Csv.js'
import { Dom } from '../Dom.js'
import { Filter } from '../Filter.js'
import { Build } from '../Build.js'
import { Tweet } from '../Tweet.js'

import '../../css/base.css'
import '../../css/dark.css'

/** Tweets and users */
let data = {}

/** JSzip Object */
let zip

/** Load a zip archive and display tweets */
function loadFile (input) {
  Dom.hideError()
  Filter.resetState()

  if (input.target.files === undefined) {
    return
  }

  Dom.clearTweets()
  Dom.hide('filter-text')
  Dom.show('loading')
  Dom.enableInput('close-file')

  console.log('File: ' + input.target.files[0].name)

  Dom.innerText('filename', Helper.truncateText(input.target.files[0].name))
  Dom.title('filename', input.target.files[0].name)

  const reader = new FileReader()
  reader.onload = function (ev) {
    JSZip.loadAsync(ev.target.result)
      .then(async function (jszip) {
        zip = jszip

        data = await Csv.process(
          Csv.find(jszip), jszip
        )

        if (data.error === true) {
          throw new Error(data.errorMessage)
        }

        Dom.hide('loading')
        Dom.hide('about')

        const build = new Build()
        build.page(data, jszip, document.getElementById('autoload').checked)

        Dom.enableInputs([
          'media-filter-reset', 'media-filter',
          'search-input', 'search', 'search-reset'
        ])
      })
      .catch(function (err) {
        Dom.hide('loading')
        Dom.displayError('Failed to load tweets.')
        Dom.show('about')
        console.error(err)
      })
  }
  reader.onerror = function (err) {
    Dom.hide('loading')
    Dom.displayError('Failed to read file.')
    console.error('Failed to read file', err)
  }
  reader.readAsArrayBuffer(input.target.files[0])
}

/** Close open zip file */
function closeFile () {
  document.getElementById('zip-file').value = ''

  Dom.innerText('filename', 'No file selected.')
  Dom.title('filename', '')

  Dom.hide('filter-text')
  Dom.disableInputs([
    'username-filter-reset', 'username-filter', 'media-filter-reset', 'media-filter',
    'search-input', 'search', 'search-reset', 'close-file'
  ])

  Dom.clearTweets()
  Filter.resetState()
  Dom.show('about')
  Dom.hide('error')
}

function handlePlaceholder (event) {
  const id = event.target.getAttribute('data-tweet-id')
  const index = Helper.getTweetIndex(id, data.tweets)
  const item = new Tweet(data.tweets[index], zip)

  event.target.parentNode.replaceChild(item.media(), event.target)
}

function clickHandler (event) {
  console.log(event)

  switch (event.target.id || event.target.className) {
    case 'username-filter-reset':
      Filter.resetFilter('username')
      Filter.run(data)
      break

    case 'media-filter-reset':
      Filter.resetFilter('media')
      Filter.run(data)
      break

    case 'search':
      Filter.run(data)
      break

    case 'search-reset':
      Filter.clearSearch()
      Filter.run(data)
      break

    case 'file-button':
      document.getElementById('zip-file').click()
      break

    case 'close-file':
      closeFile()
      break

    case 'placeholder':
      handlePlaceholder(event)
  }
}

function changeHandler (event) {
  const input = event.target

  switch (input.id) {
    case 'username-filter':
    case 'media-filter':
      Filter.run(data)
      break

    case 'zip-file':
      loadFile(event)
      break
  }
}

function keyupHandler (event) {
  const input = event.target

  switch (input.id) {
    case 'search-input':
      if (event.key === 'Enter') {
        Filter.run(data)
      }
      break

    case 'file-button':
      if (event.key === 'Enter') {
        document.getElementById('zip-file').click()
      }
      break
  }
}

const body = document.querySelector('body')
body.addEventListener('click', clickHandler)
body.addEventListener('change', changeHandler)
body.addEventListener('keyup', keyupHandler)

Dom.enableInputs(['file-button', 'zip-file', 'autoload'])
