var meta = require('./meta');
var logger = require('./logger/logger').logger;
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;

var provider = require('./provider/fireabase');

var exports = {};

exports.getFestivals = function (searchFestivalsRequest, options, callback) {
  logger.debug('getFestivals: ', searchFestivalsRequest);

  try {
    provider.getFestivals(searchFestivalsRequest, function (err, festivals) {

      if (err) {
        logger.debug('getFestivals: Unable to get festivals: ', err);
        return callback(err);
      }

      return callback(null, festivals);
    });
  }
  catch (e) {
    logger.warn('getFestivals: unable to get festivals for: ', searchFestivalsRequest, e);
    return callback(e);
  }
};

exports.VERSION = meta.VERSION;
module.exports = exports;