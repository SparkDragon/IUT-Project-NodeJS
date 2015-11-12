module.exports = {
    // The port to serve application
    port: process.env.PORT || '3000',
    // the urls business
    urls: require('./lib/urls')()
};

// test
