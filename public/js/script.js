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
	var regex = new RegExp('(?:(https?:\\/\\/[\\w.\\/-]+))', 'gm');
	var found = text.match(regex);

	if (found !== null) {
		found.forEach(url => {
			var link = '<a target="_blank" href="' + url + '">' + url + '</a>';
			text = text.replace(url, link);
		})
	}
	return text;
}

function createLinks(text) {
	text = createUrlLinks(text);
	text = createUserLinks(text);
	text = createHashtagLinks(text);

	return text;
}

/* -- Build page functions */

function buildPage(tweets, zip, autoload) {
	buildTweets(tweets, zip, autoload);
	buildFilterList(tweets);
}

function buildFilterList(tweets) {
	var users = [];

	var select = document.getElementById('username-filter');
	var button = document.getElementById('username-filter-reset');
	var opt;

	tweets.forEach(tweet => {
		if (users.includes(tweet.username) === false) {
			users.push(tweet.username);

			opt = document.createElement('option');
			opt.value = tweet.username;
			opt.innerText = tweet.display_name + ' (' + tweet.username + ')';

			select.appendChild(opt);
		}
	});

	select.disabled = false;
	button.disabled = false;
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
		body.innerHTML = createLinks(tweet.text);

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
				item.appendChild(buildMediaPlaceholder(tweet.id));
			}
		}

		item.appendChild(stats);
		items.appendChild(item);
	});
}

function buildMediaPlaceholder(tweetId) {
	var placeholder = document.createElement('div');
	placeholder.classList.add('placeholder');
	placeholder.setAttribute('data-tweet-id', tweetId);
	placeholder.innerText = 'Load media';
	
	return placeholder;
}

function buildMedia(items, zip) {
	var media = document.createElement('div');
	media.classList.add('media');

	var gallery = document.createElement('div');
	gallery.classList.add('gallery');

	items.forEach(item => {
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
		},
		function(e) {
			console.log("Error reading " + file.name + " : " + e.message);
		});

		media.appendChild(gallery)
	})

	return media;
}

/* -- Filter functions -- */

/**
 * Filter tweets by username
 */
function filter(filter) {
	var elements = document.querySelectorAll('[data-username]');
	var count = 0;

	elements.forEach(function (element) {
		var username = element.getAttribute('data-username');

		if (username !== filter) {
			element.classList.add('hide');
		} else {
			count++;
		}
	});

	innerText('username-filter-number', count);
	innerText('username-filter-name', filter);
}

/**
 * Reset filter, show all tweets
 */
function filterReset(tweetCount) {
	var elements = document.querySelectorAll('[data-username]');

	innerText('username-filter-number', tweetCount);
	innerText('username-filter-name', 'all users');

	elements.forEach(function (element) {
		element.classList.remove('hide');
	});
}

/**
 * Remove options username filter list
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
 * Search the zip file for the CSV file
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
		throw Error('CSV file not found in zip file.');
	}

	console.log('Found csv file: ' + filename);

	return filename;
}

/**
 * Process the CSV file and create an array of tweets
 */
async function processCsvFile(filename, zip) {
	return new Promise((resolve) => {
		zip.file(filename).async('text').then(function(data) {
			var results = Papa.parse(data);
			var tweets = [];

			results.data.forEach((row, index) => {
				if (index > 4) {
					var id = getIdFromUrl(row[4]);
					var index = getTweetIndex(id, tweets);

					if (index !== -1) {
						var media = {}

						if (row[5] !== 'No media') {
							media.type = row[5];
							media.url = row[6];
							media.filename = row[7];
							tweets[index].media.push(media);
						}

					} else {
						var tweet = {};
						tweet.date = row[0];
						tweet.display_name = row[2];
						tweet.username = row[3];
						tweet.url = row[4];
						tweet.id = id;
						tweet.media = [];

						var media = {}
						if (row[5] !== 'No media') {
							media.type = row[5];
							media.url = row[6];
							media.filename = row[7];
							tweet.media.push(media);
						}

						tweet.remarks = row[8];
						tweet.text = row[9];
						tweet.replies = row[10];
						tweet.retweets = row[11];
						tweet.likes = row[12];
						tweets.push(tweet);
					}
				}
			});

			resolve(tweets)
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

	var reader = new FileReader();
	reader.onload = function(ev) {
		JSZip.loadAsync(ev.target.result)
		.then(async function(zip) {
			var csvFilename = findCsvFile(zip);
			var tweets = await processCsvFile(csvFilename, zip);
			tweetCount = tweets.length;

			var autoload = document.getElementById('autoload').checked;

			hide('loading');
			hide('about');

			buildPage(tweets, zip, autoload);
			show('username-filter-text');
			show('tweets');

			document.getElementById('username-filter-number').innerText = tweetCount;
			enableInput('close-file');

			document.getElementById('username-filter').addEventListener('change', function(e) {
				filterReset(tweetCount);
				filter(e.target.value);
			});

			document.getElementById('username-filter-reset').addEventListener('click', function(e) {
				document.getElementById('username-filter').getElementsByTagName('option')[0].selected = 'selected';

				filterReset(tweetCount);
			});

			document.getElementById('close-file').addEventListener('click', function(e) {
				document.getElementById('myfile').value = '';

				hide('username-filter-text');
				disableInput('username-filter-reset');
				disableInput('username-filter');
				disableInput('close-file');
				clearTweets();
				show('about');

				tweetCount = 0;

				filterReset(0);
				loadFile();
			});

			if (autoload === false) {
				var placeholders = document.getElementsByClassName('placeholder');
				
				for (var i = 0; i < placeholders.length; i++) {
					placeholders[i].addEventListener('click', function(e) {
						var id = e.target.getAttribute('data-tweet-id');
						var index = getTweetIndex(id, tweets);

						var media = buildMedia(tweets[index].media, zip);

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

enableInput('myfile');
enableInput('autoload');
