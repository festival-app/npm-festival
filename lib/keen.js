'use strict';

const Keen = require('keen-js');
const config = require('config');
const extend = require('util')._extend;
const logger = require('./logger/logger').logger;

const client = new Keen(config.keen);

const errorCategory = function errorCategory(action, auth, searchRequest, err) {
  logger.debug('save errorCategory:', err);

  const event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent('errorCategory', event, errEvent => {
    if (errEvent) {
      logger.warn('errorCategory save err:', errEvent);
    }
  });
};

const errorEvent = function errorEvent(action, auth, searchRequest, err) {
  logger.debug('save errorEvent:', err);

  const event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent('errorEvent', event, errEvent => {
    if (errEvent) {
      logger.warn('errorEvent save err:', errEvent);
    }
  });
};

const errorPlace = function errorPlace(action, auth, searchRequest, err) {
  logger.debug('save errorEvent:', err);

  const place = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent('errorPlace', place, errEvent => {
    if (errEvent) {
      logger.warn('errorPlace save err:', errEvent);
    }
  });
};

const errorFestival = function errorFestival(action, auth, searchRequest, err) {
  logger.debug('save errorEvent:', err);

  const place = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      searchRequest: searchRequest,
      auth: auth
    }, err);

  client.addEvent('errorFestival', place, errEvent => {
    if (errEvent) {
      logger.warn('errorFestival save err:', errEvent);
    }
  });
};

const errorNews = function errorNews(action, auth, params, err) {
  logger.debug('save errorEvent:', err);

  const place = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      action: action,
      params: params,
      auth: auth
    }, err);

  client.addEvent('errorFestival', place, errEvent => {
    if (errEvent) {
      logger.warn('errorFestival save err:', errEvent);
    }
  });
};

const festivalsSearch = function festivalsSearch(auth, searchRequest) {
  logger.debug('save festivalsSearch:', searchRequest);

  const event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent('festivalsSearch', event, errEvent => {
    if (errEvent) {
      logger.warn('festivalsSearch save err:', errEvent);
    }
  });
};

const categoriesSearch = function categoriesSearch(auth, searchRequest) {
  logger.debug('save categoriesSearch:', searchRequest);

  const event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent('categoriesSearch', event, errEvent => {
    if (errEvent) {
      logger.warn('categoriesSearch save err:', errEvent);
    }
  });
};

const placesSearch = function placesSearch(auth, searchRequest) {
  logger.debug('save placesSearch:', searchRequest);

  const event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent('placesSearch', event, errEvent => {
    if (errEvent) {
      logger.warn('placesSearch save err:', errEvent);
    }
  });
};

const eventsSearch = function eventsSearch(auth, searchRequest) {
  logger.debug('save eventsSearch:', searchRequest);

  const event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent('eventsSearch', event, errEvent => {
    if (errEvent) {
      logger.warn('eventsSearch save err:', errEvent);
    }
  });
};

const newsSearch = function newsSearch(auth, searchRequest) {
  logger.debug('save newsSearch:', searchRequest);

  const event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchRequest: searchRequest,
    auth: auth
  };

  client.addEvent('newsSearch', event, errEvent => {
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