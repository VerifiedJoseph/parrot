import Papa from 'papaparse'

import { Helper } from './Helper.js'

/**
 * Work with CSV files
 */
export const Csv = {
  /**
   * Find csv file in zip archive
   *
   * @param {*} zip
   * @return {string} Filename
   */
  find: function (zip) {
    const regex = /\.csv$/
    let filename = null

    for (const [key, info] of Object.entries(zip.files)) {
      if (regex.test(info.name) === true) {
        console.log(`CSV file: ${info.name} (${key})`)
        filename = info.name
      }
    }

    if (filename === null) {
      throw Error('No CSV file not found in zip file.')
    }

    return filename
  },

  /**
   * Process csv file
   *
   * @param {string} filename CSV filename
   * @param {*} zip
   * @returns {object} Tweets data
   */
  process: async function (filename, zip) {
    return new Promise((resolve) => {
      zip.file(filename).async('text').then(function (content) {
        const results = Papa.parse(content)

        const data = {
          tweets: [],
          users: [],
          stats: {
            users: 0,
            tweets: 0,
            images: 0,
            videos: 0
          }
        }

        let rowsAfter = 0
        for (let index = 0; index < results.data.length; index++) {
          if (results.data[index][0] === 'Tweet date') {
            rowsAfter = index
            break
          }
        }

        results.data.forEach((row, index) => {
          if (index > rowsAfter) {
            if (Helper.getUserIndex(row[3], data.users) === -1) {
              const user = {
                display_name: row[2],
                username: row[3],
                tweets: 0
              }

              data.stats.users++
              data.users.push(user)
            }

            const id = Helper.getIdFromUrl(row[4])
            const tweetIndex = Helper.getTweetIndex(id, data.tweets)
            const userIndex = Helper.getUserIndex(row[3], data.users)

            if (tweetIndex === -1) {
              const tweet = {
                date: row[0],
                display_name: row[2],
                username: row[3],
                url: row[4],
                id,
                media: [],
                stats: {
                  images: 0,
                  videos: 0,
                  replies: Number(row[10]),
                  retweets: Number(row[11]),
                  likes: Number(row[12])
                },
                remarks: row[8],
                text: row[9]
              }

              const media = {}
              if (row[5] !== 'No media') {
                media.type = row[5]
                media.url = row[6]
                media.filename = row[7]
                tweet.media.push(media)

                if (row[5] === 'Image' || row[5] === 'GIF') {
                  data.stats.images++
                  tweet.stats.images++
                } else {
                  data.stats.videos++
                  tweet.stats.videos++
                }
              }

              data.stats.tweets++
              data.users[userIndex].tweets++

              data.tweets.push(tweet)
            } else if (tweetIndex !== -1 && row[5] !== 'No media') {
              const media = {
                type: row[5],
                url: row[6],
                filename: row[7]
              }

              if (row[5] === 'Image' || row[5] === 'GIF') {
                data.stats.images++
                data.tweets[tweetIndex].stats.images++
              } else {
                data.stats.videos++
                data.tweets[tweetIndex].stats.videos++
              }

              data.tweets[tweetIndex].media.push(media)
            }
          }
        })

        resolve(data)
      })
    })
  }
}
