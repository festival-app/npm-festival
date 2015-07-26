var async = require('async');
var logger = require('../logger/logger').logger;
var extend = require('util')._extend;

var festivalsModel = require('festivals-model');
var FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;
var FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;
var FestivalPlaceNotFoundError = festivalsModel.error.FestivalPlaceNotFoundError;
var FestivalCategoryNotFoundError = festivalsModel.error.FestivalCategoryNotFoundError;
var ServiceUnavailableError = festivalsModel.error.ServiceUnavailableError;

module.exports.provider = function provider(es, config) {
  var getSource = function getSource(data, callback) {
    return callback(null, data._source);
  };

  var createFestival = function createFestival(newFestival, callback) {
    logger.args('createFestival: ', arguments);

    var festivalId = newFestival.id;

    es.create(festivalId, newFestival, config.elasticsearch.festivals,
      function (error/*, result*/) {

        if (error) {
          logger.warn('Unable to add festival', error);
          return callback(new ServiceUnavailableError('Unable to add festival'));
        }

        return callback(null, newFestival);
      });
  };

  var updateFestival = function updateFestival(festivalId, newFestival, callback) {
    logger.args('updateFestival: ', arguments);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.updateFestival: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.update(festivalId, newFestival, config.elasticsearch.festivals,
        function (error/*, result*/) {

          if (error) {
            logger.warn('Unable to update festival', error);
            return callback(new ServiceUnavailableError('Unable to update festival'));
          }

          return callback(null, extend(festival, newFestival));
        });
    });
  };

  var getFestival = function getFestival(festivalId, callback) {
    logger.args('getFestival: ', arguments);

    es.get(festivalId, config.elasticsearch.festivals,
      function (error, result) {

        if (error) {
          logger.warn('Unable to get festival', error);
          return callback(new FestivalNotFoundError('Festival not found'));
        }

        if (!result) {
          return callback(new FestivalNotFoundError('Festival not found'));
        }

        return callback(null, result);
      });
  };

  var deleteFestival = function deleteFestival(festivalId, callback) {
    logger.args('deleteFestival: ', arguments);

    es.remove(festivalId, config.elasticsearch.festivals,
      function (error, result) {

        if (error) {
          logger.warn('Unable to delete festival', error);
          return callback(new FestivalNotFoundError('Festival not found'));
        }

        if (!result) {
          return callback(new FestivalNotFoundError('Festival not found'));
        }

        return callback(null, result);
      });
  };

  var getFestivals = function getFestivals(searchRequest, callback) {
    logger.args('getFestivals: ', arguments);

    var results = {
      total: 0,
      festivals: []
    };

    es.search(getElasticSearchFilters(searchRequest), config.elasticsearch.festivals,
      function (error, result) {

        if (error) {
          logger.warn('Unable to get festivals', error);
          return callback(new ServiceUnavailableError('Unable to get festivals'));
        }

        if (result.hits && result.hits.total > 0 && result.hits.hits) {
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
    logger.args('createFestivalEvent: ', arguments);

    var id = newEvent.id;

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.createFestivalEvent: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.create(id, newEvent, config.elasticsearch.events,
        function (error/*, result*/) {

          if (error) {
            logger.warn('Unable to add festival', error);
            return callback(new ServiceUnavailableError('Unable to add festival'));
          }

          return callback(null, newEvent);
        });
    });
  };

  var updateFestivalEvent = function updateFestivalEvent(festivalId, eventId, newEvent, callback) {
    logger.args('updateFestivalEvent: ', arguments);

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

        es.update(eventId, newEvent, config.elasticsearch.events,
          function (error/*, result*/) {

            if (error) {
              logger.warn('Unable to update festival event', error);
              return callback(new ServiceUnavailableError('Unable to update festival event'));
            }

            return callback(null, extend(event, newEvent));
          });
      });
    });
  };

  var getFestivalEvents = function getFestivalEvents(festivalId, searchRequest, callback) {
    logger.args('getFestivalEvents: ', arguments);

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

      searchRequest.festival = festivalId;

      es.search(getElasticSearchFilters(searchRequest), config.elasticsearch.events,
        function (error, result) {

          if (error) {
            logger.warn('Unable to get festival events', error);
            return callback(new ServiceUnavailableError('Unable to get festival events'));
          }

          if (result.hits && result.hits.total > 0 && result.hits.hits) {
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
    logger.args('getFestivalEvent: ', arguments);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.getFestivalEvent: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.get(eventId, config.elasticsearch.events,
        function (error, result) {

          if (error) {
            logger.warn('Unable to get festival event', error);
            return callback(new FestivalEventNotFoundError('Festival event not found'));
          }

          if (!result) {
            return callback(new FestivalEventNotFoundError('Festival event not found'));
          }

          return callback(null, result);
        });
    });
  };

  var deleteFestivalEvent = function deleteFestivalEvent(festivalId, eventId, callback) {
    logger.args('deleteFestivalEvent: ', arguments);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.deleteFestivalEvent: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.remove(eventId, config.elasticsearch.events,
        function (error, result) {

          if (error) {
            logger.warn('Unable to delete festival event', error);
            return callback(new FestivalEventNotFoundError('Festival event not found'));
          }

          if (!result) {
            return callback(new FestivalEventNotFoundError('Festival event not found'));
          }

          return callback(null, result);
        });
    });
  };

  var createFestivalPlace = function createFestivalPlace(festivalId, newPlace, callback) {
    logger.args('createFestivalPlace: ', arguments);

    var id = newPlace.id;

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.createFestivalPlace: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.create(id, newPlace, config.elasticsearch.places,
        function (error/*, result*/) {

          if (error) {
            logger.warn('Unable to add festival place', error);
            return callback(new ServiceUnavailableError('Unable to add festival place'));
          }

          return callback(null, newPlace);
        });
    });
  };

  var updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, callback) {
    logger.args('updateFestivalPlace: ', arguments);

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

        es.update(placeId, newPlace, config.elasticsearch.places,
          function (error/*, result*/) {

            if (error) {
              logger.warn('Unable to update festival place', error);
              return callback(new ServiceUnavailableError('Unable to update festival place'));
            }

            return callback(null, extend(place, newPlace));
          });
      });
    });
  };

  var getFestivalPlaces = function getFestivalPlaces(festivalId, searchRequest, callback) {
    logger.args('getFestivalPlaces: ', arguments);

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

      searchRequest.festival = festivalId;

      es.search(getElasticSearchFilters(searchRequest), config.elasticsearch.places,
        function (error, result) {

          if (error) {
            logger.warn('Unable to get festival places', error);
            return callback(new ServiceUnavailableError('Unable to get festival places'));
          }

          if (result.hits && result.hits.total > 0 && result.hits.hits) {
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
    logger.args('getFestivalPlace: ', arguments);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.getFestivalPlace: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.get(placeId, config.elasticsearch.places,
        function (error, result) {

          if (error) {
            logger.warn('Unable to get festival place', festivalId, placeId, error);
            return callback(new FestivalPlaceNotFoundError('Festival place not found'));
          }

          if (!result) {
            return callback(new FestivalPlaceNotFoundError('Festival place not found'));
          }

          return callback(null, result);
        });
    });
  };

  var deleteFestivalPlace = function deleteFestivalPlace(festivalId, placeId, callback) {
    logger.args('deleteFestivalPlace: ', arguments);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.deleteFestivalPlace: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.remove(placeId, config.elasticsearch.places,
        function (error, result) {

          if (error) {
            logger.warn('Unable to delete festival place', festivalId, placeId, error);
            return callback(new FestivalPlaceNotFoundError('Festival place not found'));
          }

          return callback(null, result);
        });
    });
  };

  var createFestivalCategory = function createFestivalCategory(festivalId, newCategory, callback) {
    logger.args('createFestivalCategory: ', arguments);

    var id = newCategory.id;

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.createFestivalCategory: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.create(id, newCategory, config.elasticsearch.categories,
        function (error/*, result*/) {

          if (error) {
            logger.warn('Unable to add festival place', error);
            return callback(new ServiceUnavailableError('Unable to add festival place'));
          }

          return callback(null, newCategory);
        });
    });
  };

  var updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, callback) {
    logger.args('updateFestivalCategory: ', arguments);

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

        es.update(categoryId, newCategory, config.elasticsearch.categories,
          function (error/*, result*/) {

            if (error) {
              logger.warn('Unable to update festival category', error);
              return callback(new ServiceUnavailableError('Unable to update festival category'));
            }

            return callback(null, extend(category, newCategory));
          });
      });
    });
  };

  var getElasticSearchFilters = function getElasticSearchFilters(searchParameters) {

    var searchData = {
      query: {
        filtered: {
          query: {
            match_all: {}
          }
        }
      }
    };

    if (searchParameters.limit > 0) {
      searchData.size = searchParameters.limit;
    }

    if (searchParameters.offset > 0) {
      searchData.from = searchParameters.offset;
    }

    var filters = [];

    for (var name in searchParameters) {
      if (searchParameters.hasOwnProperty(name)) {
        var value = searchParameters[name];

        if (value && name !== 'limit' && name !== 'offset') {
          var term = {
            term: {}
          };

          term.term[name] = value;
          filters.push(term);
        }
      }
    }

    if (filters && filters.length > 0) {
      searchData.query.filtered.filter = {
        and: filters
      };
    }

    return searchData;
  };


  var getFestivalCategories = function getFestivalCategories(festivalId, searchRequest, callback) {
    logger.args('getFestivalCategories: ', arguments);

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

      searchRequest.festival = festivalId;

      es.search(getElasticSearchFilters(searchRequest), config.elasticsearch.categories,
        function (error, result) {

          if (error) {
            logger.warn('Unable to get festival categories', error);
            return callback(new ServiceUnavailableError('Unable to get festival categories'));
          }

          if (result.hits && result.hits.total > 0 && result.hits.hits) {
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
    logger.args('getFestivalCategory: ', arguments);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.getFestivalCategory: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.get(categoryId, config.elasticsearch.categories,
        function (error, result) {

          if (error) {
            logger.warn('Unable to get festival category', error);
            return callback(new FestivalCategoryNotFoundError('Festival category not found'));
          }

          if (!result) {
            return callback(new FestivalCategoryNotFoundError('Festival category not found'));
          }

          return callback(null, result);
        });
    });
  };

  var deleteFestivalCategory = function deleteFestivalCategory(festivalId, categoryId, callback) {
    logger.args('deleteFestivalCategory: ', arguments);

    getFestival(festivalId, function (err, festival) {
      logger.debug('elasticsearch.deleteFestivalCategory: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      es.remove(categoryId, config.elasticsearch.categories,
        function (error, result) {

          if (error) {
            logger.warn('Unable to delete festival category', error);
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
    deleteFestival: deleteFestival,
    createFestivalEvent: createFestivalEvent,
    updateFestivalEvent: updateFestivalEvent,
    getFestivalEvents: getFestivalEvents,
    getFestivalEvent: getFestivalEvent,
    deleteFestivalEvent: deleteFestivalEvent,
    createFestivalPlace: createFestivalPlace,
    updateFestivalPlace: updateFestivalPlace,
    getFestivalPlaces: getFestivalPlaces,
    getFestivalPlace: getFestivalPlace,
    deleteFestivalPlace: deleteFestivalPlace,
    createFestivalCategory: createFestivalCategory,
    updateFestivalCategory: updateFestivalCategory,
    getFestivalCategories: getFestivalCategories,
    getFestivalCategory: getFestivalCategory,
    deleteFestivalCategory: deleteFestivalCategory
  };
};