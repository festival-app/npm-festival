var Keen = require('keen-js');
var config = require('config');
var extend = require('util')._extend;
var logger = require('./logger/logger').logger;

var client = new Keen(config.keen);

var errorEvent = function (auth, searchFestivalsRequest, err) {
  logger.debug('save errorEvent:', err);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchFestivalsRequest: searchFestivalsRequest,
      auth: auth
    }, err);

  client.addEvent("errorEvent", event, function (err) {
    if (err) {
      logger.warn('errorEvent save err:', err);
    }
  });
};

var festivalsSearch = function (auth, searchFestivalsRequest) {
  logger.debug('save festivalsSearch:', searchFestivalsRequest);

  var event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchFestivalsRequest: searchFestivalsRequest,
    auth: auth
  };

  client.addEvent("festivalsSearch", event, function (err) {
    if (err) {
      logger.warn('festivalsSearch save err:', err);
    }
  });
};

module.exports = {
  errorEvent: errorEvent,
  festivalsSearch: festivalsSearch
};