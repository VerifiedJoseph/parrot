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
