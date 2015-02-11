var express = require('express');
var router = express.Router();
var config = require('../config');
var urls = config.urls;

/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.render('admin.html', { title: 'Administration' });
});
	
router.get('/urls', function(req, res, next) {
	urls.getAll(function(data) {
		res.format({
			'text/plain': function() {
				var content = "";
				for (var i = 0; i < data.length; ++i)
					content += data[i].base + " : + " + data[i].link + "\n";
				res.send(content);
			},

			'text/html': function() {
				var content = "<ul>";
				for (var i = 0; i < data.length; ++i)
					content += "<li>" + data[i].base + " : " + data[i].link + "</li>";
				content += "<ul>";
				res.send(content);
			},

			'application/json': function() {
				res.json(data);
			},

			'default': function() {
				res.status(406).send('Not Acceptable');
			}
		});
	});
});
	
router.get('/hits', function(req, res, next) {
	urls.getHits(function(hits) {
		res.format({
			'text/plain': function() {
				res.send("Hits : " + hits);
			},

			'text/html': function() {
				res.send("Hits : " + hits);
			},

			'application/json': function() {
				res.json(hits);
			},

			'default': function() {
				res.status(406).send('Not Acceptable');
			}
		});
	});
});

module.exports = router;
