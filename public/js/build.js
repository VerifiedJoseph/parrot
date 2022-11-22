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
    var autoLinker = new Autolinker({
        urls: {
            schemeMatches: true,
            tldMatches: true,
            ipV4Matches: true
        },
        email: true,
        mention: 'twitter',
        hashtag: 'twitter',
        stripPrefix: false,
        stripTrailingSlash : false,
        newWindow: true,
    });
    
    return autoLinker.link(text);
}

function buildTweets(tweets, zip, autoload) {
    var items = document.getElementById('tweets');
    items.innerHTML = '';

    document.getElementById('tweets');

    tweets.forEach(tweet => {
        var item = document.createElement('div');
        item.classList.add('tweet');
        item.setAttribute('data-username', tweet.username);
        item.setAttribute('data-id', tweet.id);
        item.setAttribute('data-timestamp', tweet.date);

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
    var placeholder = document.createElement('button');
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

            media.appendChild(buildMediaError(item.filename))
        }
    })

    return media;
}

function buildMediaError(filename) {
    var error = document.createElement('div');
    error.classList.add('error');
    error.innerText = 'File not found: ' + filename;

    return error;
}