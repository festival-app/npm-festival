var config = require('config');
var http = require('https');
var extend = require('util')._extend;
var logger = require('./logger/logger').logger;

var purge = function purge(token, path) {
  var opts = extend({}, config.cache.purge.options);

  opts.headers.Authorization = 'Bearer ' + token;

  if (path) {
    opts.path = path;
  }

  var req = http.request(opts, function (res) {
    if (res.statusCode !== 200) {
      logger.warn('unexpected status for purge cache: ' + res.statusCode);
    }
    res.on('data', function(d) {
      process.stdout.write(d);
    });
  });

  req.on('error', function (e) {
    logger.warn('problem with purge cache request: ' + e.message);
  });

  req.end();
};

module.exports = {
  purge: purge
};
