'use strict';

const config = require('config');
const http = require('https');
const extend = require('util')._extend;
const logger = require('./logger/logger').logger;

const purge = function purge(token, path) {

  return;
  const opts = extend({}, config.cache.purge.options);

  opts.headers.Authorization = `Bearer ${token}`;

  if (path) {
    opts.path = path;
  }

  const req = http.request(opts, res => {
    if (res.statusCode !== 200) {
      logger.warn(`unexpected status for purge cache: ${res.statusCode}`);
    }
    res.on('data', chunk => {
      logger.info('purge response', chunk.toString('utf8'));
    });
  });

  req.on('error', ({message}) => {
    logger.warn(`problem with purge cache request: ${message}`, opts);
  });

  req.end();
};

module.exports = {
  purge: purge
};
