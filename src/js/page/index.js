import JSZip from 'jszip'

import { Helper } from '../Helper.js'
import { Csv } from '../Csv.js'
import { Dom } from '../Dom.js'
import { Filter } from '../Filter.js'
import { Build } from '../Build.js'
import { Tweet } from '../Tweet.js'

import '../../css/base.css'
import '../../css/dark.css'

/**
 * Tweets and users
 */
let data = {}

/**
 * Load a zip archive and display tweets
 */
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
      .then(async function (zip) {
        data = await Csv.process(
          Csv.find(zip),
          zip
        )

        if (data.error === true) {
          throw new Error(data.errorMessage)
        }

        const autoload = document.getElementById('autoload').checked

        Dom.hide('loading')
        Dom.hide('about')

        const build = new Build()
        build.page(data, zip, autoload)

        Dom.enableInputs([
          'media-filter-reset', 'media-filter',
          'search-input', 'search', 'search-reset'
        ])

        if (autoload === false) {
          const placeholders = document.getElementsByClassName('placeholder')

          for (let i = 0; i < placeholders.length; i++) {
            placeholders[i].addEventListener('click', function (e) {
              const id = e.target.getAttribute('data-tweet-id')
              const index = Helper.getTweetIndex(id, data.tweets)
              const item = new Tweet(data.tweets[index], zip)

              e.target.parentNode.replaceChild(item.media(), e.target)
            })
          }
        }
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

/**
 * Event listener for username filter change
 */
document.getElementById('username-filter').addEventListener('change', function (e) {
  Filter.run(data)
})

/**
 * Event listener for media type filter change
 */
document.getElementById('media-filter').addEventListener('change', function (e) {
  Filter.run(data)
})

/**
 * Event listener for username filter reset button
 */
document.getElementById('username-filter-reset').addEventListener('click', function (e) {
  Filter.resetFilter('username')
  Filter.run(data)
})

/**
 * Event listener for media type filter reset button
 */
document.getElementById('media-filter-reset').addEventListener('click', function (e) {
  Filter.resetFilter('media')
  Filter.run(data)
})

/**
 * Event listener for Enter key pass on tweet search
 */
document.getElementById('search-input').addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    Filter.run(data)
  }
})

/**
 * Event listener for tweet search button
 */
document.getElementById('search').addEventListener('click', function (e) {
  Filter.run(data)
})

/**
 * Event listener for tweet search reset
 */
document.getElementById('search-reset').addEventListener('click', function (e) {
  Filter.clearSearch()
  Filter.run(data)
})

/**
 * Event listener for file close button
 */
document.getElementById('close-file').addEventListener('click', function (e) {
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
})

/**
 * Event listener for zip file
 */
document.getElementById('zip-file').addEventListener('change', loadFile)

/**
 * Event listener for zip file enter key pass
 */
document.getElementById('file-button').addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    document.getElementById('zip-file').click()
  }
})

/**
 * Event listener for file button click
 */
document.getElementById('file-button').addEventListener('click', function (e) {
  document.getElementById('zip-file').click()
})

Dom.enableInputs(['file-button', 'zip-file', 'autoload'])
