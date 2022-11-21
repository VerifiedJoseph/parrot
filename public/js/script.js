/* -- DOM functions -- */
function displayError(text) {
    innerText('error', text);
    show('error');
} 

function hideError() {
    innerText('error', '');
    hide('error');
} 

function clearTweets() {
    hide('tweets');
    innerText('tweets', '');
}

function show(element) {
    document.getElementById(element).classList.remove('hide');
}

function hide(element) {
    document.getElementById(element).classList.add('hide');
}

function disableInput(element) {
    document.getElementById(element).disabled = true;
}

function enableInput(element) {
    document.getElementById(element).disabled = false;
}

function innerText(element, text) {
    document.getElementById(element).innerText = text;
}

/* -- Helper functions -- */

/**
 * Get the array index for a Tweet via its ID
 */
function getTweetIndex(id, tweets) {
    var check = (element) => element.id === id
    return tweets.findIndex(check);
}

/**
 * Get the array index for a User via its username
 */
 function getUserIndex(username, users) {
    var check = (element) => element.username === username
    return users.findIndex(check);
}

/**
 * Extract tweet ID from tweet URL
 */
 function getIdFromUrl(url) {
    var regex = new RegExp('https?:\\/\\/twitter\\.com\\/\\w+\\/status\\/([0-9]+)');
    var id = url.match(regex);
    return id[1];
}

function formatNumber(number) {
    return new Intl.NumberFormat().format(number)
}

/* -- Link create functions -- */

function createUserLinks(text) {
    var regex = new RegExp('(?:(@[\\w]+))', 'gm');
    var found = text.match(regex);

    if (found !== null) {
        found.forEach(username => {
            var link = '<a target="_blank" href="https://twitter.com/' + username + '">' + username + '</a>';
            text = text.replace(username, link);
        })
    }
    return text;
}

function createHashtagLinks(text) {
    var regex = new RegExp('(?:(#[\\w]+))', 'gm');
    var found = text.match(regex);

    if (found !== null) {
        found.forEach(hashtag => {
            var link = '<a target="_blank" href="https://twitter.com/hashtag/' + hashtag.substring(1) + '">' + hashtag + '</a>';
            text = text.replace(hashtag, link);
        })
    }
    return text;
}

function createUrlLinks(text) {
    var regex = new RegExp('(https?:\\/\\/(?:www\\.)?(?:[a-zA-Z0-9-.]{1,256}\\.[a-z]{2,20})(\\:[0-9]{2,4})?(?:\\/[a-zA-Z0-9@:%_\\+.,~#"\\\'!?&\\/\\/=\\-*]+|\\/)?)', 'gm');
    var found = text.match(regex);

    if (found !== null) {
        found.forEach(url => {
            var link = '<a target="_blank" href="' + url + '">' + url + '</a>';
            text = text.replace(url, link);
        })
    }
    return text;
}

/* -- Build page functions */

function buildPage(data, zip, autoload) {
    buildTweets(data.tweets, zip, autoload);
    buildFilterList(data.users);

    innerText('username-filter-number', data.tweets.length);
    innerText('username-filter-name', data.users.length + ' users');

    show('username-filter-text');
    show('tweets');
}

function buildFilterList(users) {
    var select = document.getElementById('username-filter');
    var button = document.getElementById('username-filter-reset');
    var opt;

    users.forEach(user => {
            opt = document.createElement('option');
            opt.value = user.username;
            opt.innerText = user.display_name + ' (' + user.username + ') - '
                + formatNumber(user.tweets) + ' tweets';

            select.appendChild(opt);
    });

    select.disabled = false;
    button.disabled = false;
}

function buildLinks(text) {
    text = createUrlLinks(text);
    text = createUserLinks(text);
    text = createHashtagLinks(text);

    return text;
}

function buildTweets(tweets, zip, autoload) {
    var items = document.getElementById('tweets');
    items.innerHTML = '';

    document.getElementById('tweets');

    tweets.forEach(tweet => {
        var item = document.createElement('div');
        item.classList.add('tweet');
        item.setAttribute('data-username', tweet.username);
    
        var header = document.createElement('div');
        header.classList.add('header');

        var body = document.createElement('div');
        body.classList.add('body');
        body.innerHTML = buildLinks(tweet.text);

        var stats = document.createElement('div');
        stats.classList.add('stats');
        stats.innerText = formatNumber(tweet.replies) + ' Replies - '
            + formatNumber(tweet.retweets) +' Retweets - '
            + formatNumber(tweet.likes) + ' Likes';

        var name = document.createElement('div');
        name.classList.add('name');
    
        var nameLink = document.createElement('a');
        nameLink.innerText = tweet.display_name;
        nameLink.setAttribute('href', 'https://twitter.com/' + tweet.username);
        nameLink.setAttribute('target', '_blank');
        name.appendChild(nameLink);

        var username = document.createElement('div');
        username.classList.add('username');
        username.innerText = tweet.username;

        var br = document.createElement('br');

        name.appendChild(br);
        name.appendChild(username);

        var date = document.createElement('div');
        date.classList.add('date');

        var dateLink = document.createElement('a');
        dateLink.innerText = tweet.date;
        dateLink.setAttribute('href', tweet.url);
        dateLink.setAttribute('target', '_blank');

        date.appendChild(dateLink);

        var clear = document.createElement('div');
        clear.classList.add('clear');

        header.appendChild(name);
        header.appendChild(date);
        header.appendChild(clear);

        item.appendChild(header);
        item.appendChild(body);

        if (tweet.media.length !== 0) {
            if (autoload === true) {
                item.appendChild(buildMedia(tweet.media, zip));
            } else {
                item.appendChild(buildMediaPlaceholder(tweet.id, tweet.stats));
            }
        }

        item.appendChild(stats);
        items.appendChild(item);
    });
}

function buildMediaPlaceholder(tweetId, stats) {
    var placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.setAttribute('data-tweet-id', tweetId);

    var text = 'Load media ';

    if (stats.images > 0) {
        var word = ' images';

        if (stats.images === 1) {
            word = ' image';
        }

        text += '('+ stats.images + word +')';
    }

    if (stats.videos > 0) {
        var word = ' videos';

        if (stats.videos === 1) {
            word = ' video';
        }

        text += '('+ stats.videos + word +')';
    }

    placeholder.innerText = text;
    
    return placeholder;
}

function buildMedia(items, zip) {
    var media = document.createElement('div');
    media.classList.add('media');

    var gallery = document.createElement('div');
    gallery.classList.add('gallery');

    items.forEach(item => {
        if (zip.file(item.filename) !== null) {
            zip.file(item.filename)
            .async("arraybuffer")
            .then(function(content) {
                var buffer = new Uint8Array(content);
                var blob = new Blob([buffer.buffer]);
                var url = URL.createObjectURL(blob);
    
                if (item.type === 'Image') {
                    var image = new Image;
                    image.src = url;
                    image.setAttribute('loading', 'lazy');
    
                    var element = document.createElement('a');
                    element.setAttribute('href', url);
                    element.setAttribute('target', '_blank');
    
                    element.appendChild(image);
                }
    
                if (item.type === 'Video' || item.type == 'GIF') {
                    var element = document.createElement('video');
                    element.src = url;
                    element.setAttribute('controls', '');
                }
    
                var div = document.createElement('div')
                div.appendChild(element)
    
                gallery.appendChild(div)
            })
            .catch(function(err) {
                console.error(err);
            })

            media.appendChild(gallery)
        } else {
            console.log('file not found: ' + item.filename);

            var error = document.createElement('div');
            error.classList.add('error');
            error.innerText = 'File not found: ' + item.filename;

            media.appendChild(error)
        }
    })

    return media;
}

/* -- Filter functions -- */

/**
 * Filter tweets by username
 */
function filter(users, filter) {
    var index = getUserIndex(filter, users);
    var user = users[index];

    var elements = document.querySelectorAll('[data-username]');

    elements.forEach(function (element) {
        var username = element.getAttribute('data-username');

        if (username !== filter) {
            element.classList.add('hide');
        }
    });

    innerText('username-filter-number', user.tweets);
    innerText('username-filter-name', user.username);
}

/**
 * Reset filter, show all tweets
 */
function filterReset(count) {
    var elements = document.querySelectorAll('[data-username]');

    innerText('username-filter-number', count);
    innerText('username-filter-name', 'all users');

    elements.forEach(function (element) {
        element.classList.remove('hide');
    });
}

/**
 * Remove username options from filter list
 */
function clearFilterList() {
    var filter = document.getElementById('username-filter');

    filter.querySelectorAll('option').forEach(function (element, index) {
        if (index != 0) {
            element.parentNode.removeChild(element)
        }
    });

    filter.getElementsByTagName('option')[0].selected = 'selected';
}

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
                                videos: 0
                            },
                            remarks: row[8],
                            text: row[9],
                            replies: Number(row[10]),
                            retweets: Number(row[11]),
                            likes: Number(row[12]),
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

            document.getElementById('username-filter').addEventListener('change', function(e) {
                filterReset(data.stats.tweets);
                filter(data.users, e.target.value);
            });

            document.getElementById('username-filter-reset').addEventListener('click', function(e) {
                document.getElementById('username-filter').getElementsByTagName('option')[0].selected = 'selected';

                filterReset(data.stats.tweets);
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
    disableInput('close-file');
    clearTweets();
    clearFilterList();
    show('about');
    hide('error');
});

enableInput('myfile');
enableInput('autoload');
