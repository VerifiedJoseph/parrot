/* -- CSV file functions -- */

/**
 * Search the zip file for the required CSV file
 */
function findCsvFile(zip) {
    var regex = new RegExp('\\.csv$');
    var filename = null;

    for (const [key, info] of Object.entries(zip.files)) {
        if (regex.test(info.name) === true) {
            filename = info.name;
        }
    }

    if (filename === null) {
        throw Error('No CSV file not found in zip file.');
    }

    console.log('CSV file: ' + filename);

    return filename;
}

/**
 * Process the CSV file and create an array of tweets
 */
async function processCsvFile(filename, zip) {
    return new Promise((resolve) => {
        zip.file(filename).async('text').then(function(content) {
            var results = Papa.parse(content);

            var data = {
                tweets: [],
                users: [],
                stats: {
                    users: 0,
                    tweets: 0,
                    images: 0,
                    videos: 0
                }
            };

            var rowsAfter = 0;
            for (var index = 0; index < results.data.length; index++) {
                if (results.data[index][0] == 'Tweet date') {
                    rowsAfter = index;
                    break;
                }
            }

            results.data.forEach((row, index) => {
                if (index > rowsAfter) {

                    if (getUserIndex(row[3], data.users) === -1) {
                        var user = {
                            display_name: row[2],
                            username: row[3],
                            tweets: 0
                        }

                        data.stats.users++;
                        data.users.push(user);
                    }

                    var id = getIdFromUrl(row[4]);
                    var tweetIndex = getTweetIndex(id, data.tweets);
                    var userIndex = getUserIndex(row[3], data.users);

                    if (tweetIndex === -1) {
                        var tweet = {
                            date: row[0],
                            display_name: row[2],
                            username: row[3],
                            url: row[4],
                            id: id,
                            media: [],
                            stats: {
                                images: 0,
                                videos: 0,
                                replies: Number(row[10]),
                                retweets: Number(row[11]),
                                likes: Number(row[12])
                            },
                            remarks: row[8],
                            text: row[9],
                        };

                        var media = {}
                        if (row[5] !== 'No media') {
                            media.type = row[5];
                            media.url = row[6];
                            media.filename = row[7];
                            tweet.media.push(media);

                            if (row[5] === 'Image') {
                                data.stats.images++;
                                tweet.stats.images++;
                            } else {
                                data.stats.videos++;
                                tweet.stats.videos++;
                            }
                        }

                        data.stats.tweets++;
                        data.users[userIndex].tweets++;

                        data.tweets.push(tweet);
                    } else if (tweetIndex !== -1 && row[5] !== 'No media') {
                        var media = {
                            type: row[5],
                            url: row[6],
                            filename: row[7]
                        }

                        if (row[5] === 'Image') {
                            data.stats.images++;
                            data.tweets[tweetIndex].stats.images++;
                        } else {
                            data.stats.videos++;
                            data.tweets[tweetIndex].stats.videos++;
                        }

                        data.tweets[tweetIndex].media.push(media);
                    }
                }
            });

            resolve(data)
        })
    });  
}

/**
 * Load a zip archive and display tweets
 */
function loadFile(fileInput) {
    hideError();
    clearFilterList();

    if(fileInput == undefined) {
        return;
    }

    clearTweets();
    show('loading');
    enableInput('close-file');

    console.log('File: ' + fileInput.files[0].name);

    var reader = new FileReader();
    reader.onload = function(ev) {
        JSZip.loadAsync(ev.target.result)
        .then(async function(zip) {
            var csvFilename = findCsvFile(zip);
            var data = await processCsvFile(csvFilename, zip);

            var autoload = document.getElementById('autoload').checked;

            console.log(data);

            hide('loading');
            hide('about');

            buildPage(data, zip, autoload);

            enableInput('media-filter-reset');
            enableInput('media-filter');

            document.getElementById('username-filter').addEventListener('change', function(e) {
                filter(data);
            });

            document.getElementById('media-filter').addEventListener('change', function(e) {
                filter(data);
            });

            document.getElementById('username-filter-reset').addEventListener('click', function(e) {
                document.getElementById('username-filter').getElementsByTagName('option')[0].selected = 'selected';
                filter(data);
            });

            document.getElementById('media-filter-reset').addEventListener('click', function(e) {
                document.getElementById('media-filter').getElementsByTagName('option')[0].selected = 'selected';
                filter(data);
            });

            if (autoload === false) {
                var placeholders = document.getElementsByClassName('placeholder');
                
                for (var i = 0; i < placeholders.length; i++) {
                    placeholders[i].addEventListener('click', function(e) {
                        var id = e.target.getAttribute('data-tweet-id');
                        var index = getTweetIndex(id, data.tweets);
                        var media = buildMedia(data.tweets[index].media, zip);

                        e.target.parentNode.replaceChild(media, e.target);
                    });
                }
            }
        })
        .catch(function(err) {
            hide('loading');
            displayError('Failed to load tweets.');
            show('about');
            console.error(err);
        })
    };
    reader.onerror = function(err) {
        hide('loading');
        displayError('Failed to read file.');
        console.error('Failed to read file', err);
    }
    reader.readAsArrayBuffer(fileInput.files[0]);
}

document.getElementById('close-file').addEventListener('click', function(e) {
    document.getElementById('myfile').value = '';

    hide('username-filter-text');
    disableInput('username-filter-reset');
    disableInput('username-filter');
    disableInput('media-filter-reset');
    disableInput('media-filter');

    disableInput('close-file');
    clearTweets();
    clearFilterList();
    show('about');
    hide('error');
});

enableInput('myfile');
enableInput('autoload');
