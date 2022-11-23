/**
 * Filter tweets
 */
 function filter(data) {
    var userFilter = document.getElementById('username-filter').value;
    var mediaFilter = document.getElementById('media-filter').value;

    var elements = document.querySelectorAll('div.tweet');
    elements.forEach(function (element) {
        element.classList.add('hide');
    });

    var filtered = data.tweets.filter(function (tweet) {
        if (userFilter !== 'all' && tweet.username !== userFilter) {
            return false;
        }

        if (mediaFilter !== 'all') {
            switch (mediaFilter) {
                case 'none':
                    if (tweet.media.length > 0) {
                        return false;
                    }
                    break;
                case 'videos':
                    if (tweet.stats.videos === 0) {
                        return false;
                    }
                    break;
                default:
                    if (tweet.stats.images === 0) {
                        return false;
                    }
                    break;
            }
        }

        var element = document.querySelector('div[data-id="'+ tweet.id +'"]');
        element.classList.remove('hide');

        return true;
    })

    innerText('username-filter-number', formatNumber(filtered.length));

    var name = userFilter;
    if (userFilter !== 'none') {
        if (userFilter ==='all') {
            name =  formatNumber(data.stats.users) + ' users';
        }

        innerText('username-filter-name', name);
    }
}

/**
 * Remove username options from user filter list
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