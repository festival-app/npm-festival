'use strict';

var Keen = require('keen-js');
var config = require('config');
var extend = require('util')._extend;
var logger = require('./logger/logger').logger;

var client = new Keen(config.keen);

var errorCategory = function errorCategory(action, auth, searchRequest, err) {
  logger.debug('save errorCategory:', err);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent('errorCategory', event, function (errEvent) {
    if (errEvent) {
      logger.warn('errorCategory save err:', errEvent);
    }
  });
};

var errorEvent = function errorEvent(action, auth, searchRequest, err) {
  logger.debug('save errorEvent:', err);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent('errorEvent', event, function (errEvent) {
    if (errEvent) {
      logger.warn('errorEvent save err:', errEvent);
    }
  });
};

var errorPlace = function errorPlace(action, auth, searchRequest, err) {
  logger.debug('save errorEvent:', err);

  var place = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent('errorPlace', place, function (errEvent) {
    if (errEvent) {
      logger.warn('errorPlace save err:', errEvent);
    }
  });
};

var errorFestival = function errorFestival(action, auth, searchRequest, err) {
  logger.debug('save errorEvent:', err);

  var place = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent('errorFestival', place, function (errEvent) {
    if (errEvent) {
      logger.warn('errorFestival save err:', errEvent);
    }
  });
};

var errorNews = function errorNews(action, auth, params, err) {
  logger.debug('save errorEvent:', err);

  var place = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      params: params,
      auth: auth
    }, err);

  client.addEvent('errorFestival', place, function (errEvent) {
    if (errEvent) {
      logger.warn('errorFestival save err:', errEvent);
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

  client.addEvent('festivalsSearch', event, function (errEvent) {
    if (errEvent) {
      logger.warn('festivalsSearch save err:', errEvent);
    }
  });
};

var categoriesSearch = function categoriesSearch(auth, searchRequest) {
  logger.debug('save categoriesSearch:', searchRequest);

  var event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent('categoriesSearch', event, function (errEvent) {
    if (errEvent) {
      logger.warn('categoriesSearch save err:', errEvent);
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

  client.addEvent('placesSearch', event, function (errEvent) {
    if (errEvent) {
      logger.warn('placesSearch save err:', errEvent);
    }
  });
};

var eventsSearch = function eventsSearch(auth, searchRequest) {
  logger.debug('save eventsSearch:', searchRequest);

  var event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent('eventsSearch', event, function (errEvent) {
    if (errEvent) {
      logger.warn('eventsSearch save err:', errEvent);
    }
  });
};

var newsSearch = function newsSearch(auth, searchRequest) {
  logger.debug('save newsSearch:', searchRequest);

  var event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent('newsSearch', event, function (errEvent) {
    if (errEvent) {
      logger.warn('newsSearch save err:', errEvent);
    }
  });
};

module.exports = {
  errorCategory: errorCategory,
  errorPlace: errorPlace,
  errorFestival: errorFestival,
  errorEvent: errorEvent,
  errorNews: errorNews,
  categoriesSearch: categoriesSearch,
  placesSearch: placesSearch,
  festivalsSearch: festivalsSearch,
  eventsSearch: eventsSearch,
  newsSearch: newsSearch
};