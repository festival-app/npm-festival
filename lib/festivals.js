var meta = require('./meta');
var logger = require('./logger/logger').logger;
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;

var provider = require('./provider/fireabase');

var getFestival = function getFestival(id, options, callback) {
  logger.debug('getFestival: ', id);

  try {
    provider.getFestival(id, function (err, festival) {

      if (err) {
        logger.debug('getFestival: Unable to get festival: ', err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('getFestival: unable to get festival for id: ', id, e);
    return callback(e);
  }
};

var getFestivals = function getFestivals(searchFestivalsRequest, options, callback) {
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

var getFestivalEvent = function getFestivalEvent(id, options, callback) {
  logger.debug('getFestivalEvent: ', id);

  try {
    provider.getFestivalEvent(id, function (err, festival) {

      if (err) {
        logger.debug('getFestivalEvent: Unable to get festival: ', err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('getFestivalEvent: unable to get festival event for id: ', id, e);
    return callback(e);
  }
};

var getFestivalEvents = function getFestivalEvents(id, searchFestivalEventsRequest, options, callback) {
  logger.debug('getFestivalEvents: ', id, searchFestivalEventsRequest);

  try {
    provider.getFestivalEvents(id, searchFestivalEventsRequest, function (err, festivalEvents) {

      if (err) {
        logger.debug('getFestivalEvents: Unable to get festival events: ', err);
        return callback(err);
      }

      return callback(null, festivalEvents);
    });
  }
  catch (e) {
    logger.warn('getFestivalEvents: unable to get festival events for: ', id, searchFestivalEventsRequest, e);
    return callback(e);
  }
};

module.exports = {
  VERSION: meta.VERSION,
  getFestival: getFestival,
  getFestivals: getFestivals,
  getFestivalEvent: getFestivalEvent,
  getFestivalEvents: getFestivalEvents
};