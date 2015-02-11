function initAll () {
	socket = io.connect('http://localhost:1337');
	
	socket.on('urlAdded', onUrlReceived);
	socket.on('hitAdded', onHitReceived);
	socket.on('invalidUrl', onInvalidUrl);
	
	var shortenButton = document.getElementById('shortenButton');
	var urlInput = document.getElementById('url');
	
	shortenButton.addEventListener('click', onShortenButtonClicked, false);
	urlInput.addEventListener('keypress', function (e) {
		var key = e.which || e.keyCode;
		if (key == 13) { 
			onShortenButtonClicked();
		}
	});
	
	loadUrls();
	loadHits();
}

function onUrlReceived (data) {
	console.log("Shortened URL : " + data.base + " -> " + data.link);	
	addUrlInDOM(data.base, data.link);
}

function onHitReceived () {
	console.log("New hit");
	incrementHits();
}

function onInvalidUrl () {
	console.log("invalid url");
	alert("Invalid URL !");
}

function onShortenButtonClicked () {
	var input = document.getElementById('url');
	var data = input.value;
	
	if (checkUrl(data)) {
		input.value = "";
		socket.emit('addUrl', { url: data });
		console.log('url sent');
	}
	else {
		onInvalidUrl();
	}
}

function loadHits () {
	var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            insertHits(xhr.responseText);
        }
    };
    xhr.open("GET", "./admin/hits", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "application/json");
	xhr.send(null);
}

function insertHits (hits) {
	var hitCount = document.getElementById('hitCount');
	hitCount.innerHTML = hits;
}

function loadUrls () {
	var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            insertUrls(xhr.responseText);
        }
    };
    xhr.open("GET", "./admin/urls", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "application/json");
	xhr.send(null);
}

function insertUrls (urls) {
	urls = JSON.parse(urls);
	for(var i in urls) {
		var url = urls[i];
		addUrlInDOM(url.base, url.link);
	}
	var loader = document.getElementById('barLoader');
	var table = document.getElementById('urls');
	
	loader.parentNode.removeChild(loader);
	table.style.display = "table";
}

function addUrlInDOM(base, link) {
	var table = document.getElementById('urls').getElementsByTagName('tbody')[0];
	var tr = document.createElement('tr');
	
	var tdBase = document.createElement('td');
	var tdLink = document.createElement('td');
	
	var aBase = document.createElement('a');
	var aLink = document.createElement('a');
	
	aBase.href = base;
	aBase.innerHTML = base;
	
	aLink.href = link;
	aLink.innerHTML = link;
	
	aBase.className = "baseUrl";
	aLink.className = "shortenUrl";
	
	aBase.target = "_blank";
	aLink.target = "_blank";
	
	tdBase.appendChild(aBase);
	tdLink.appendChild(aLink);
	
	tr.appendChild(tdBase);
	tr.appendChild(tdLink);
	
	table.appendChild(tr);
	incrementShortenedLinks();
}

function incrementHits () {
	var hitCount = document.getElementById('hitCount').innerHTML;
	if (hitCount == "-")
		hitCount = 0;
	else
		hitCount = parseInt(hitCount);
	document.getElementById('hitCount').innerHTML = hitCount + 1;
}

function incrementShortenedLinks () {
	var linkCount = document.getElementById('linkCount').innerHTML;
	if (linkCount == "-")
		linkCount = 0;
	else
		linkCount = parseInt(linkCount);
	document.getElementById('linkCount').innerHTML = linkCount + 1;
}

function checkUrl (url) {
	if (url === null || typeof url === 'undefined')
		return false;
		
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	return regexp.test(url);   
}

document.addEventListener('DOMContentLoaded', initAll, false);
