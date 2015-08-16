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

  client.addEvent('errorCategory', event, function (err) {
    if (err) {
      logger.warn('errorCategory save err:', err);
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

  client.addEvent('errorEvent', event, function (err) {
    if (err) {
      logger.warn('errorEvent save err:', err);
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

  client.addEvent('errorPlace', place, function (err) {
    if (err) {
      logger.warn('errorPlace save err:', err);
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

  client.addEvent('errorFestival', place, function (err) {
    if (err) {
      logger.warn('errorFestival save err:', err);
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

  client.addEvent('errorFestival', place, function (err) {
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

  client.addEvent('festivalsSearch', event, function (err) {
    if (err) {
      logger.warn('festivalsSearch save err:', err);
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

  client.addEvent('categoriesSearch', event, function (err) {
    if (err) {
      logger.warn('categoriesSearch save err:', err);
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

  client.addEvent('placesSearch', event, function (err) {
    if (err) {
      logger.warn('placesSearch save err:', err);
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

  client.addEvent('eventsSearch', event, function (err) {
    if (err) {
      logger.warn('eventsSearch save err:', err);
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

  client.addEvent('newsSearch', event, function (err) {
    if (err) {
      logger.warn('newsSearch save err:', err);
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