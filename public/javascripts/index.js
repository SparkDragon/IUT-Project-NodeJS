function initAll () {	
	var shortenButton = document.getElementById("shortenButton");
	var urlInput = document.getElementById("url");
	
	shortenButton.addEventListener("click", onShortenButtonClicked, false);
	urlInput.addEventListener('keypress', function (e) {
		var key = e.which || e.keyCode;
		if (key == 13) { 
			onShortenButtonClicked();
		}
	});
}

function onUrlReceived (data) {
	data = JSON.parse(data);
	displayLoader(false);
	console.log("url received : " + data.link);
	
	var shortenUrl = document.getElementById("shortenUrl");
	shortenUrl.innerHTML = "Shortened URL : " + data.link;
}

function onInvalidUrl () {
	displayLoader(false);
	console.log("invalid url");
	
	var shortenUrl = document.getElementById("shortenUrl");
	shortenUrl.innerHTML = "Invalid URL !";
}

function onShortenButtonClicked () {
	displayLoader(true);
	var shortenUrl = document.getElementById("shortenUrl");
	shortenUrl.innerHTML = "";
	
	var input = document.getElementById("url");
	var url = input.value;
	
	if (checkUrl(url)) {
		getShortenedUrl(url);
		console.log('url sent');
	}
	else {
		onInvalidUrl();
	}
}

function getShortenedUrl (url) {
	var xhr = getXMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            onUrlReceived(xhr.responseText);
        }
    };
    xhr.open("POST", "./url", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Accept", "application/json");
	xhr.send("url=" + url);
}

function checkUrl (url) {
	if (url === null || typeof url === "undefined")
		return false;
		
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	return regexp.test(url);   
}

function displayLoader (display) {
	display = (display !== false) ? true : false;
	style = (display !== false) ? "inline" : "none";
	
	var urlInput = document.getElementById("url");
	urlInput.readOnly = display;
	
	var loader = document.getElementById('loaderImg');
	loader.style.display = style;
}

document.addEventListener("DOMContentLoaded", initAll, false);
