var express = require('express');
var router = express.Router();
var config = require('../config');
var urls = config.urls;

function displayLinkNotFound (res) {
	res.render('error.html', { message: "Link not found", status: 404});
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index.html', { title: 'Simple URL Shortner' });
});

router.post('/url', function(req, res, next) {
	var url = req.body.url;
	if (typeof url !== "undefined" && urls.isValid(url)) {
		console.log('ok');
		urls.add(url, function(data) {
			res.format({
				'text/plain': function() {
					res.send("Shortened URL : " + data.link);
				},

				'text/html': function() {
					res.send("Shortened URL : " + data.link);
				},

				'application/json': function() {
					res.json(data);
				},

				'default': function() {
					res.send(data.link);
				}
			});
		});
	}
});

/* GET home page. */
router.all('/*', function(req, res, next) {
	var url = req.url;
	var id = url.substr(1);
	
	if (id.length !== 5) {
		displayLinkNotFound(res);
	}
	else {
		urls.get(id, function(url) {
			if (url !== null) {
				urls.hit();
				res.writeHead(301, {Location: url});
				res.end();
			}
			else {
				displayLinkNotFound(res);
			}
		});
	}
});

module.exports = router;
