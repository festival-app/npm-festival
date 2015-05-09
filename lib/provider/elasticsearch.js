var async = require('async');
var config = require('config');
var es = require('../elasticsearch/es');
var logger = require('../logger/logger').logger;

var festivalsModel = require('festivals-model');
var FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;
//var FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;
var ServiceUnavailableError = festivalsModel.error.ServiceUnavailableError;

var getSource = function getSource(data, callback) {
  return callback(null, data['_source']);
};

var createFestival = function createFestival(newFestival, callback) {
  logger.debug('elasticsearch.createFestival: ', newFestival);
  var festivalId = newFestival.id;

  es.create(festivalId, newFestival, config.elasticsearch.festivals, function (error, result) {

    if (error) {
      logger.warn('Unable to add festival', error);
      return callback(new ServiceUnavailableError('Unable to add festival'));
    }

    return callback(null, newFestival);
  });
};

var getFestival = function getFestival(festivalId, callback) {
  logger.debug('elasticsearch.getFestival: ', festivalId);

  es.get(festivalId, config.elasticsearch.festivals, function (error, result) {

    if (!result) {
      return callback(new FestivalNotFoundError('Festival not found'));
    }

    return callback(null, result);
  });
};

var getFestivals = function getFestivals(searchFestivalsRequest, callback) {
  logger.debug('elasticsearch.getFestivals: ', searchFestivalsRequest);

  var results = {
    total: 0,
    festivals: []
  };

  //TODO
  var body = {
    size: searchFestivalsRequest.limit,
    from: searchFestivalsRequest.offset,
    query: {
      filtered: {
        query: {
          match_all: {}
        }
        //filter: filter
      }
    }
  };

  es.search(body, config.elasticsearch.festivals, function (error, result) {

    if (result.hits.total > 0 && result.hits.hits) {
      async.map(result.hits.hits, getSource, function (err, festivals) {
        results.total = result.hits.total;
        results.festivals = festivals;
        return callback(null, results);
      });
    }
    else {
      return callback(null, results);
    }
  });
};

var createFestivalPlace = function createFestivalPlace(festivalId, newPlace, callback) {
  logger.debug('elasticsearch.createFestivalPlace: ', festivalId, newPlace);
  var id = newPlace.id;

  //TODO festivalId CHECK
  es.create(id, newPlace, config.elasticsearch.place, function (error, result) {

    if (error) {
      logger.warn('Unable to add festival place', error);
      return callback(new ServiceUnavailableError('Unable to add festival place'));
    }

    return callback(null, newPlace);
  });
};

var createFestivalEvent = function createFestivalEvent(festivalId, newEvent, callback) {
  logger.debug('elasticsearch.createFestivalEvent: ', festivalId, newEvent);
  var id = newEvent.id;

  getFestival(festivalId, function (err, festival) {
    logger.debug('elasticsearch.createFestivalEvent: getFestival', festival);

    if (err || !festival) {
      logger.debug(err);
      return callback(new FestivalNotFoundError('Festival not found'));
    }

    //TODO add festival id
    es.create(id, newEvent, config.elasticsearch.events, function (error, result) {

      if (error) {
        logger.warn('Unable to add festival', error);
        return callback(new ServiceUnavailableError('Unable to add festival'));
      }

      return callback(null, newEvent);
    });
  });
};

var getFestivalEvents = function getFestivalEvents(festivalId, searchFestivalEventsRequest, callback) {
  logger.debug('firebase.getFestivalEvents: ', festivalId, searchFestivalEventsRequest);

  var results = {
    total: 0,
    events: []
  };

  //TODO
  var body = {
    size: searchFestivalEventsRequest.limit,
    from: searchFestivalEventsRequest.offset,
    query: {
      filtered: {
        query: {
          match_all: {}
        }
        //filter: filter
      }
    }
  };

  es.search(body, config.elasticsearch.events, function (error, result) {

    if (result.hits.total > 0 && result.hits.hits) {
      async.map(result.hits.hits, getSource, function (err, events) {
        results.total = result.hits.total;
        results.events = events;
        return callback(null, results);
      });
    }
    else {
      return callback(null, results);
    }
  });

};

var getFestivalEvent = function getFestivalEvent(festivalId, eventId, callback) {
  logger.debug('elasticsearch.getFestivalEvent: ', festivalId, eventId);

  es.get(eventId, config.elasticsearch.events, function (error, result) {
    if (!result) {
      return callback(new FestivalNotFoundError('Festival event not found'));
    }

    return callback(null, result);
  });
};

module.exports = {
  createFestivalPlace: createFestivalPlace,
  createFestival: createFestival,
  getFestivals: getFestivals,
  getFestival: getFestival,
  createFestivalEvent: createFestivalEvent,
  getFestivalEvents: getFestivalEvents,
  getFestivalEvent: getFestivalEvent
};