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