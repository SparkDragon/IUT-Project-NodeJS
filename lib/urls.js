var EventEmitter = require('events').EventEmitter;
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

const SERVER_NAME = "https://urlshortener.herokuapp.com/";
const MONGODB_URL = "mongodb://licencepro:lic3nc3pr0@ds041831.mongolab.com:41831/urlshortner";

module.exports = function () {

    var dispatcher = new EventEmitter();
	
    var Urls = {
		
		isValid: function isValid(url) {
			var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
			return regexp.test(url);   
		},
		
        get: function get(urlId, callback) {
			MongoClient.connect(MONGODB_URL, function(err, db) {
				var url = null;
				assert.equal(null, err);			
				
				var collection = db.collection('urls');
				collection.find({id: urlId}).toArray(function(err, docs) {
					if (docs !== null && docs.length === 1)
						url = docs[0].url;
					else
						console.log("Url not found"); 
					db.close();
					callback(url);
				});
			});
        },
		
        getAll: function getAll(callback) {
			MongoClient.connect(MONGODB_URL, function(err, db) {
				assert.equal(null, err);	
				
				var links = [];
				var collection = db.collection('urls');
				collection.find().toArray(function(err, docs) {
					if (docs !== null && docs.length > 0) {
						for (var i = 0; i < docs.length; ++i)
							links.push({base: docs[i].url, link: SERVER_NAME + "/" + docs[i].id});
					}
					else
						console.log("No url in the data base"); 
					db.close();
					callback(links);
				});
			});
        },
		
        add: function add(baseUrl, callback) {
			if (typeof baseUrl !== "undefined" && this.isValid(baseUrl)) {
				var urlId = this.createId(function(urlId) {
					
					var newUrl = SERVER_NAME + "/" + urlId;
					
					MongoClient.connect(MONGODB_URL, function(err, db) {
						assert.equal(null, err);
						
						var collection = db.collection('urls');
						collection.insert({id : urlId, url: baseUrl}, function(err, result) {
							dispatcher.emit('newUrl', {base: baseUrl, link: newUrl});
						
							db.close();
							if (typeof callback !== "undefined" && callback !== null)
								callback({link: newUrl});
						});
					});
				});
			}
			else
				dispatcher.emit('invalidUrl');
        },
		
        hit: function hit(callback) {
			MongoClient.connect(MONGODB_URL, function(err, db) {
				assert.equal(null, err);
				
				var collection = db.collection('hits');
				collection.find({id: "hits"}).toArray(function(err, docs) {
					
					if (docs !== null && docs.length === 1)
						hits = docs[0].count;
					else
						hits = 0;
						
					collection.update({id : "hits"}, {$set: {count: (hits + 1)}}, function(err, result) {
						dispatcher.emit('newHit');
						db.close();
						if (typeof callback !== "undefined" && callback !== null)
							callback();
					});
				});
			});
		},
		
        getHits: function getHits(callback) {
			var hits = 0;
			MongoClient.connect(MONGODB_URL, function(err, db) {
				assert.equal(null, err);
				
				var collection = db.collection('hits');
				collection.find({id: "hits"}).toArray(function(err, docs) {
					if (docs !== null && docs.length === 1)
						hits = docs[0].count;
					else
						console.log("The data base is empty"); 
					db.close();
					callback(hits);
				});
			});
        },
    
		generateId: function generateId() {
			var id = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 5; i++)
				id += possible.charAt(Math.floor(Math.random() * possible.length));

			return id;
		},
		
		createId: function createId(callback) {
			var urlId = this.generateId();
			
			MongoClient.connect(MONGODB_URL, function(err, db) {
				var url = null;
				assert.equal(null, err);			
				
				var urls = [];
				var collection = db.collection('urls');
				collection.find({id: urlId}).toArray(function(err, docs) {
					if (docs !== null && docs.length === 1) {
						this.createId(callback);
					}
					else {
						callback(urlId);
					}
					db.close();
				});
			});
		},
		
        listenToNewUrl: function (callback) {
            dispatcher.on('newUrl', callback);
        },
		
        listenToHit: function (callback) {
            dispatcher.on('newHit', callback);
        },
		
        listenToInvalidUrl: function (callback) {
            dispatcher.on('invalidUrl', callback);
        }
    };
    
    return Urls;
};
