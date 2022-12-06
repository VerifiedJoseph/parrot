import JSZip from 'jszip'

import { Helper } from '../Helper.js'
import { Csv } from '../Csv.js'
import { Dom } from '../Dom.js'
import { Filter } from '../Filter.js'
import { Build } from '../Build.js'

import '../../css/style.css'
import '../../css/dark.css'
import '../../images/meta-image.png'

/**
 * Load a zip archive and display tweets
 */
function loadFile (input) {
  Dom.hideError()
  Filter.clearUsernames()

  if (input.target.files === undefined) {
    return
  }

  Dom.clearTweets()
  Dom.show('loading')
  Dom.enableInput('close-file')

  console.log('File: ' + input.target.files[0].name)

  const reader = new FileReader()
  reader.onload = function (ev) {
    JSZip.loadAsync(ev.target.result)
      .then(async function (zip) {
        const csvFilename = Csv.find(zip)
        const data = await Csv.process(csvFilename, zip)
        const autoload = document.getElementById('autoload').checked

        Dom.hide('loading')
        Dom.hide('about')

        Build.page(data, zip, autoload)

        Dom.enableInput('media-filter-reset')
        Dom.enableInput('media-filter')
        Dom.enableInput('search-input')
        Dom.enableInput('search')
        Dom.enableInput('search-reset')

        document.getElementById('username-filter').addEventListener('change', function (e) {
          Filter.run(data)
        })

        document.getElementById('media-filter').addEventListener('change', function (e) {
          Filter.run(data)
        })

        document.getElementById('username-filter-reset').addEventListener('click', function (e) {
          document.getElementById('username-filter').getElementsByTagName('option')[0].selected = 'selected'
          Filter.run(data)
        })

        document.getElementById('search').addEventListener('click', function (e) {
          Filter.run(data)
        })

        document.getElementById('search-reset').addEventListener('click', function (e) {
          document.getElementById('search-input').value = ''
          Filter.run(data)
        })

        document.getElementById('media-filter-reset').addEventListener('click', function (e) {
          document.getElementById('media-filter').getElementsByTagName('option')[0].selected = 'selected'
          Filter.run(data)
        })

        if (autoload === false) {
          const placeholders = document.getElementsByClassName('placeholder')

          for (let i = 0; i < placeholders.length; i++) {
            placeholders[i].addEventListener('click', function (e) {
              const id = e.target.getAttribute('data-tweet-id')
              const index = Helper.getTweetIndex(id, data.tweets)
              const media = Build.media(data.tweets[index].media, zip)

              e.target.parentNode.replaceChild(media, e.target)
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

document.getElementById('close-file').addEventListener('click', function (e) {
  document.getElementById('zip-file').value = ''

  Dom.hide('filter-text')
  Dom.disableInput('username-filter-reset')
  Dom.disableInput('username-filter')
  Dom.disableInput('media-filter-reset')
  Dom.disableInput('media-filter')
  Dom.disableInput('search-input')
  Dom.disableInput('search')
  Dom.disableInput('search-reset')

  Dom.disableInput('close-file')
  Dom.clearTweets()
  Filter.clearUsernames()
  Dom.show('about')
  Dom.hide('error')
})

document.getElementById('zip-file').addEventListener('change', loadFile)

Dom.enableInput('zip-file')
Dom.enableInput('autoload')
