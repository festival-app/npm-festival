var Keen = require('keen-js');
var config = require('config');
var extend = require('util')._extend;
var logger = require('./logger/logger').logger;

var client = new Keen(config.keen);

var errorEvent = function errorEvent(auth, searchRequest, err) {
  logger.debug('save errorEvent:', err);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent("errorEvent", event, function (err) {
    if (err) {
      logger.warn('errorEvent save err:', err);
    }
  });
};

var errorPlace = function errorPlace(auth, searchRequest, err) {
  logger.debug('save errorEvent:', err);

  var place = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent("errorPlace", place, function (err) {
    if (err) {
      logger.warn('errorPlace save err:', err);
    }
  });
};

var errorFestival = function errorFestival(auth, searchRequest, err) {
  logger.debug('save errorEvent:', err);

  var place = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent("errorFestival", place, function (err) {
    if (err) {
      logger.warn('errorFestival save err:', err);
    }
  });
};

var festivalsSearch = function festivalsSearch(auth, searchRequest) {
  logger.debug('save festivalsSearch:', searchRequest);

  var event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent("festivalsSearch", event, function (err) {
    if (err) {
      logger.warn('festivalsSearch save err:', err);
    }
  });
};

var placesSearch = function placesSearch(auth, searchRequest) {
  logger.debug('save placesSearch:', searchRequest);

  var event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent("placesSearch", event, function (err) {
    if (err) {
      logger.warn('placesSearch save err:', err);
    }
  });
};

var festivalsSearch = function festivalsSearch(auth, searchRequest) {
  logger.debug('save festivalsSearch:', searchRequest);

  var event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent("festivalsSearch", event, function (err) {
    if (err) {
      logger.warn('festivalsSearch save err:', err);
    }
  });
};

module.exports = {
  errorPlace: errorPlace,
  errorFestival: errorFestival,
  errorEvent: errorEvent,
  festivalsSearch: festivalsSearch,
  placesSearch: placesSearch,
  festivalsSearch: festivalsSearch
};