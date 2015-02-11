var test = require('tape');

function assertArray(t, val) {
    t.equal(Object.prototype.toString.call(val), '[object Array]');
}

test('Module should be loaded', function (t) {
    t.plan(1);

    var urls = require('../../lib/urls');
    t.ok(urls, "Test Constructor");
});

test('it should not valid the url', function (t) {
	t.plan(1);
	
    var urls = require('../../lib/urls')();
    t.notOk(urls.isValid("azerty"), "Test Invalid URL");
});

test('it should valid the url', function (t) {
	t.plan(1);
	
    var urls = require('../../lib/urls')();
    t.ok(urls.isValid("http://google.com"), "Test Valid URL");
});

test('it should not get an url (key too long)', function (t) {
	t.plan(1);
	
    var urls = require('../../lib/urls')();
    urls.get("azerty", function (data) {
		t.equal(data, null, "Test URL too long");
	});
});

test('it should create a shortened url', function (t) {
	t.plan(1);
	
    var urls = require('../../lib/urls')();
    urls.add("http://test.com", function (data) {
		t.notEqual(data, null, "Test create an URL");
	});
});

test('it should get at least one shortened url', function (t) {
	t.plan(1);
	
    var urls = require('../../lib/urls')();
    urls.add("http://test.com", function (data) {
		urls.getAll(function (links) {
			assertArray(t, links, "Test Get All URLs");
		});
	});
});

test('it should add a visit', function (t) {
	t.plan(1);
	
    var urls = require('../../lib/urls')();
    urls.hit(function () {
		t.pass("Test Hit");
	});
});

test('it should get the number of visits', function (t) {
	t.plan(1);
	
    var urls = require('../../lib/urls')();
    urls.getHits(function () {
		t.pass("Test get Hit number");
	});
});

test('it should generate a 5 chars long id', function (t) {
	t.plan(1);
	
    var urls = require('../../lib/urls')();
    var id = urls.generateId();
	t.equal(id.length, 5, "Test generate Id");
});

test('it should create an unique id', function (t) {
	t.plan(1);
	
    var urls = require('../../lib/urls')();
    urls.createId(function(id) {
		urls.get(id, function (url) {
			t.equal(url, null, "Test unique id created");
		});
	});
});

test('it should call listener when url is added', function (t) {
    t.plan(1);

    function spy() {
		t.pass('should be called');
    }

    var urls = require('../../lib/urls')([]);

    urls.listenToNewUrl(spy);

    urls.add('http://google.com');
});

test('it should call all listeners when when url is added', function (t) {
    t.plan(2);

    function spy1() {
		t.pass('should be called');
    }

    function spy2() {
		t.pass('should be called');
    }

    var urls = require('../../lib/urls')([]);

    urls.listenToNewUrl(spy1);
    urls.listenToNewUrl(spy2);

    urls.add('http://google.com');
});

test('it should call listener when an invalid url is added', function (t) {
    t.plan(1);

    function spy() {
		t.pass('should be called');
    }

    var urls = require('../../lib/urls')([]);

    urls.listenToInvalidUrl(spy);

    urls.add('azerty');
});

test('it should call all listeners when an invalid url is added', function (t) {
    t.plan(2);

    function spy1() {
		t.pass('should be called');
    }

    function spy2() {
		t.pass('should be called');
    }

    var urls = require('../../lib/urls')([]);

    urls.listenToInvalidUrl(spy1);
    urls.listenToInvalidUrl(spy2);

    urls.add('azerty');
});

test('it should call listener when an url is visited', function (t) {
    t.plan(1);

    function spy() {
		t.pass('should be called');
    }

    var urls = require('../../lib/urls')([]);

    urls.listenToHit(spy);

    urls.hit();
});

test('it should call all listeners when an url is visited', function (t) {
    t.plan(2);

    function spy1() {
		t.pass('should be called');
    }

    function spy2() {
		t.pass('should be called');
    }

    var urls = require('../../lib/urls')([]);

    urls.listenToHit(spy1);
    urls.listenToHit(spy2);

    urls.hit();
});
