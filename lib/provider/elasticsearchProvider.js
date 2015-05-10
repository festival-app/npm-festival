var async = require('async');
var config = require('config');
var logger = require('../logger/logger').logger;
var extend = require('util')._extend;

var festivalsModel = require('festivals-model');
var FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;
var FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;
var FestivalPlaceNotFoundError = festivalsModel.error.FestivalPlaceNotFoundError;
var FestivalCategoryNotFoundError = festivalsModel.error.FestivalCategoryNotFoundError;
var ServiceUnavailableError = festivalsModel.error.ServiceUnavailableError;

module.exports.provider = function provider(es) {
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

  var updateFestival = function updateFestival(festivalId, newFestival, callback) {
    logger.debug('elasticsearch.updateFestival: ', festivalId, newFestival);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.updateFestival: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.update(festivalId, newFestival, config.elasticsearch.festivals, function (error, result) {

        if (error) {
          logger.warn('Unable to update festival', error);
          return callback(new ServiceUnavailableError('Unable to update festival'));
        }

        return callback(null, extend(festival, newFestival));
      });
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

  var createFestivalEvent = function createFestivalEvent(festivalId, newEvent, callback) {
    logger.debug('elasticsearch.createFestivalEvent: ', festivalId, newEvent);
    var id = newEvent.id;

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.createFestivalEvent: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.create(id, newEvent, config.elasticsearch.events, function (error, result) {

        if (error) {
          logger.warn('Unable to add festival', error);
          return callback(new ServiceUnavailableError('Unable to add festival'));
        }

        return callback(null, newEvent);
      });
    });
  };

  var updateFestivalEvent = function updateFestivalEvent(festivalId, eventId, newEvent, callback) {
    logger.debug('elasticsearch.updateFestivalEvent: ', festivalId, eventId, newEvent);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.updateFestivalEvent: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      getFestivalEvent(festivalId, eventId, function (err, event) {
        logger.debug('elasticsearch.updateFestivalEvent: getFestivalEvent', event);

        if (err || !event) {
          logger.debug(err);
          return callback(new FestivalEventNotFoundError('Festival event not found'));
        }

        es.update(eventId, newEvent, config.elasticsearch.events, function (error, result) {

          if (error) {
            logger.warn('Unable to update festival event', error);
            return callback(new ServiceUnavailableError('Unable to update festival event'));
          }

          return callback(null, extend(event, newEvent));
        });
      });
    });
  };

  var getFestivalEvents = function getFestivalEvents(festivalId, searchFestivalEventsRequest, callback) {
    logger.debug('elasticsearch.getFestivalEvents: ', festivalId, searchFestivalEventsRequest);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.getFestivalEvents: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

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
    });
  };

  var getFestivalEvent = function getFestivalEvent(festivalId, eventId, callback) {
    logger.debug('elasticsearch.getFestivalEvent: ', festivalId, eventId);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.getFestivalEvent: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.get(eventId, config.elasticsearch.events, function (error, result) {

        if (!result) {
          return callback(new FestivalEventNotFoundError('Festival event not found'));
        }

        return callback(null, result);
      });
    });
  };

  var createFestivalPlace = function createFestivalPlace(festivalId, newPlace, callback) {
    logger.debug('elasticsearch.createFestivalPlace: ', festivalId, newPlace);
    var id = newPlace.id;

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.createFestivalPlace: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.create(id, newPlace, config.elasticsearch.places, function (error, result) {

        if (error) {
          logger.warn('Unable to add festival place', error);
          return callback(new ServiceUnavailableError('Unable to add festival place'));
        }

        return callback(null, newPlace);
      });
    });
  };

  var updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, callback) {
    logger.debug('elasticsearch.updateFestivalPlace: ', festivalId, newPlace);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.updateFestivalPlace: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      getFestivalPlace(festivalId, placeId, function (err, place) {

        if (err || !place) {
          logger.debug(err);
          return callback(new FestivalPlaceNotFoundError('Festival place not found'));
        }

        es.update(placeId, newPlace, config.elasticsearch.places, function (error, result) {

          if (error) {
            logger.warn('Unable to update festival place', error);
            return callback(new ServiceUnavailableError('Unable to update festival place'));
          }

          return callback(null, extend(place, newPlace));
        });
      });
    });
  };

  var getFestivalPlaces = function getFestivalPlaces(festivalId, searchFestivalPlacesRequest, callback) {
    logger.debug('elasticsearch.getFestivalPlaces: ', festivalId, searchFestivalPlacesRequest);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.getFestivalPlaces: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      var results = {
        total: 0,
        places: []
      };

      //TODO
      var body = {
        size: searchFestivalPlacesRequest.limit,
        from: searchFestivalPlacesRequest.offset,
        query: {
          filtered: {
            query: {
              match_all: {}
            }
            //filter: filter
          }
        }
      };

      es.search(body, config.elasticsearch.places, function (error, result) {

        if (result.hits.total > 0 && result.hits.hits) {
          async.map(result.hits.hits, getSource, function (err, places) {
            results.total = result.hits.total;
            results.places = places;
            return callback(null, results);
          });
        }
        else {
          return callback(null, results);
        }
      });
    });
  };

  var getFestivalPlace = function getFestivalPlace(festivalId, placeId, callback) {
    logger.debug('elasticsearch.getFestivalPlace: ', festivalId, placeId);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.getFestivalPlace: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.get(placeId, config.elasticsearch.places, function (error, result) {

        if (!result) {
          return callback(new FestivalPlaceNotFoundError('Festival place not found'));
        }

        return callback(null, result);
      });
    });
  };

  var createFestivalCategory = function createFestivalCategory(festivalId, newCategory, callback) {
    logger.debug('elasticsearch.createFestivalCategory: ', festivalId, newCategory);
    var id = newCategory.id;

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.createFestivalCategory: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.create(id, newCategory, config.elasticsearch.categories, function (error, result) {

        if (error) {
          logger.warn('Unable to add festival place', error);
          return callback(new ServiceUnavailableError('Unable to add festival place'));
        }

        return callback(null, newCategory);
      });
    });
  };

  var updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, callback) {
    logger.debug('elasticsearch.updateFestivalCategory: ', festivalId, newCategory);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.updateFestivalCategory: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      getFestivalCategory(festivalId, categoryId, function (err, category) {

        if (err || !category) {
          logger.debug(err);
          return callback(new FestivalCategoryNotFoundError('Festival category not found'));
        }

        es.update(categoryId, newCategory, config.elasticsearch.categories, function (error, result) {

          if (error) {
            logger.warn('Unable to update festival category', error);
            return callback(new ServiceUnavailableError('Unable to update festival category'));
          }

          return callback(null, extend(category, newCategory));
        });
      });
    });
  };

  var getFestivalCategories = function getFestivalCategories(festivalId, searchFestivalCategoriesRequest, callback) {
    logger.debug('elasticsearch.getFestivalCategories: ', festivalId, searchFestivalCategoriesRequest);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.getFestivalCategories: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      var results = {
        total: 0,
        categories: []
      };

      //TODO
      var body = {
        size: searchFestivalCategoriesRequest.limit,
        from: searchFestivalCategoriesRequest.offset,
        query: {
          filtered: {
            query: {
              match_all: {}
            }
            //filter: filter
          }
        }
      };

      es.search(body, config.elasticsearch.categories, function (error, result) {

        if (result.hits.total > 0 && result.hits.hits) {
          async.map(result.hits.hits, getSource, function (err, categories) {
            results.total = result.hits.total;
            results.categories = categories;
            return callback(null, results);
          });
        }
        else {
          return callback(null, results);
        }
      });
    });
  };

  var getFestivalCategory = function getFestivalCategory(festivalId, categoryId, callback) {
    logger.debug('elasticsearch.getFestivalCategory: ', festivalId, categoryId);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.getFestivalCategory: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.get(categoryId, config.elasticsearch.categories, function (error, result) {
        if (!result) {
          return callback(new FestivalCategoryNotFoundError('Festival category not found'));
        }

        return callback(null, result);
      });
    });
  };

  return {
    createFestival: createFestival,
    updateFestival: updateFestival,
    getFestivals: getFestivals,
    getFestival: getFestival,
    createFestivalEvent: createFestivalEvent,
    updateFestivalEvent: updateFestivalEvent,
    getFestivalEvents: getFestivalEvents,
    getFestivalEvent: getFestivalEvent,
    createFestivalPlace: createFestivalPlace,
    updateFestivalPlace: updateFestivalPlace,
    getFestivalPlaces: getFestivalPlaces,
    getFestivalPlace: getFestivalPlace,
    createFestivalCategory: createFestivalCategory,
    updateFestivalCategory: updateFestivalCategory,
    getFestivalCategories: getFestivalCategories,
    getFestivalCategory: getFestivalCategory
  }
};