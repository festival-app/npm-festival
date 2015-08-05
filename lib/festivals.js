var meta = require('./meta');
var async = require('async');
var logger = require('./logger/logger').logger;
var provider = require('./provider/provider').getProvider();
var extend = require('util')._extend;

var CategoryBreadcrumbs = require('./breadcrumbs/categoryBreadcrumbs').CategoryBreadcrumbs;
var PlaceBreadcrumbs = require('./breadcrumbs/placeBreadcrumbs').PlaceBreadcrumbs;

var decorateEvent = function decorateEvent(event, callback) {
  getPlaceAndCategory(event.festival, event.place, event.category, function (err, data) {
    return callback(null, extend(event, data));
  });
};

var getPlaceAndCategory = function getPlaceAndCategory(id, place, category, callback) {

  async.parallel({
    place: function (cb) {
      return cb(null, placeBreadcrumbs.get(id, place));
    },
    category: function (cb) {
      return cb(null, categoryBreadcrumbs.get(id, category));
    }
  }, callback);
};


var createFestival = function createFestival(newFestival, options, callback) {
  logger.debug('createFestival: ', newFestival);

  try {
    provider.createFestival(newFestival, function (err, festival) {

      if (err) {
        logger.debug('Unable to create festival: ', festival, err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('unable to create festival: ', e);
    return callback(e);
  }
};

var updateFestival = function updateFestival(festivalId, newFestival, options, callback) {
  logger.debug('updateFestival: ', festivalId, newFestival);

  try {
    provider.updateFestival(festivalId, newFestival, function (err, festival) {

      if (err) {
        logger.debug('Unable to update festival: ', newFestival, err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('unable to update festival: ', e);
    return callback(e);
  }
};

var getFestival = function getFestival(id, options, callback) {
  logger.debug('getFestival: ', id);

  try {
    provider.getFestival(id, function (err, festival) {

      if (err) {
        logger.debug('Unable to get festival: ', err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('unable to get festival for id: ', id, e);
    return callback(e);
  }
};

var deleteFestival = function deleteFestival(id, options, callback) {
  logger.debug('deleteFestival: ', id);

  try {
    provider.deleteFestival(id, function (err, festival) {

      if (err) {
        logger.debug('Unable to delete festival: ', err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('unable to delete festival for id: ', id, e);
    return callback(e);
  }
};

var getFestivals = function getFestivals(searchRequest, options, callback) {
  logger.debug('getFestivals: ', searchRequest);

  try {
    provider.getFestivals(searchRequest, function (err, festivals) {

      if (err) {
        logger.debug('Unable to get festivals: ', err);
        return callback(err);
      }

      return callback(null, festivals);
    });
  }
  catch (e) {
    logger.warn('unable to get festivals for: ', searchRequest, e);
    return callback(e);
  }
};

var createFestivalEvent = function createFestivalEvent(festivalId, newEvent, options, callback) {
  logger.debug('createFestivalEvent: ', festivalId, newEvent);

  try {
    provider.createFestivalEvent(festivalId, newEvent, function (err, event) {

      if (err) {
        logger.debug('Unable to create festival event: ', festivalId, newEvent, err);
        return callback(err);
      }

      getPlaceAndCategory(festivalId, event.place, event.category, function (err, event) {
        if (err) {
          logger.debug('Unable to create festival event: ', festivalId, newEvent, err);
          return callback(err);
        }

        return callback(null, event);
      });
    });
  }
  catch (e) {
    logger.warn('unable to create festival: ', e);
    return callback(e);
  }
};

var updateFestivalEvent = function updateFestivalEvent(festivalId, eventId, newEvent, options, callback) {
  logger.debug('updateFestivalEvent: ', festivalId, eventId, newEvent);

  try {
    provider.updateFestivalEvent(festivalId, eventId, newEvent, function (err, festival) {

      if (err) {
        logger.debug('updateFestivalEvent: Unable to update festival event: ', newEvent, err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('updateFestivalEvent: unable to update festival event: ', e);
    return callback(e);
  }
};

var getFestivalEvent = function getFestivalEvent(festivalId, eventId, options, callback) {
  logger.debug('getFestivalEvent: ', festivalId, eventId);

  try {
    provider.getFestivalEvent(festivalId, eventId, function (err, event) {

      if (err) {
        logger.debug('Unable to get festival event: ', err);
        return callback(err);
      }

      return callback(null, event);
    });
  }
  catch (e) {
    logger.warn('unable to get festival event for id: ', festivalId, eventId, e);
    return callback(e);
  }
};

var deleteFestivalEvent = function deleteFestivalEvent(festivalId, eventId, options, callback) {
  logger.debug('deleteFestivalEvent: ', festivalId, eventId);

  try {
    provider.deleteFestivalEvent(festivalId, eventId, function (err, event) {

      if (err) {
        logger.debug('Unable to delete festival event: ', err);
        return callback(err);
      }

      return callback(null, event);
    });
  }
  catch (e) {
    logger.warn('unable to delete festival event for id: ', festivalId, eventId, e);
    return callback(e);
  }
};

var getFestivalEvents = function getFestivalEvents(id, searchRequest, options, callback) {
  logger.debug('getFestivalEvents: ', id, searchRequest);

  try {
    provider.getFestivalEvents(id, searchRequest, function (err, data) {

      if (err) {
        logger.debug('Unable to get festival events: ', err);
        return callback(err);
      }

      //TODO!!!
      async.map(data.events, decorateEvent, function (err, events) {
        data.events = events;
        return callback(null, data);
      });
    });
  }
  catch (e) {
    logger.warn('unable to get festival events for: ', id, searchRequest, e);
    return callback(e);
  }
};

var createFestivalPlace = function createFestivalPlace(festivalId, newPlace, options, callback) {
  logger.debug('createFestivalPlace: ', festivalId, newPlace);

  try {
    provider.createFestivalPlace(festivalId, newPlace, function (err, place) {

      if (err) {
        logger.debug('Unable to create festival place: ', festivalId, newPlace, err);
        return callback(err);
      }

      placeBreadcrumbs.updateBreadcrumbs(festivalId, place);

      return callback(null, place);
    });
  }
  catch (e) {
    logger.warn('unable to create festival: ', e);
    return callback(e);
  }
};

var updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, options, callback) {
  logger.debug('updateFestivalPlace: ', festivalId, placeId, newPlace);

  try {
    provider.updateFestivalPlace(festivalId, placeId, newPlace, function (err, festival) {

      if (err) {
        logger.debug('Unable to update festival place: ', newPlace, err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('unable to update festival place: ', e);
    return callback(e);
  }
};

var getFestivalPlace = function getFestivalPlace(festivalId, placeId, options, callback) {
  logger.debug('getFestivalPlace: ', festivalId, placeId);

  try {
    provider.getFestivalPlace(festivalId, placeId, function (err, place) {

      if (err) {
        logger.debug('Unable to get festival place: ', err);
        return callback(err);
      }

      return callback(null, place);
    });
  }
  catch (e) {
    logger.warn('unable to get festival place for id: ', festivalId, placeId, e);
    return callback(e);
  }
};

var deleteFestivalPlace = function deleteFestivalPlace(festivalId, placeId, options, callback) {
  logger.debug('deleteFestivalPlace: ', festivalId, placeId);

  try {
    provider.deleteFestivalPlace(festivalId, placeId, function (err, place) {

      if (err) {
        logger.debug('Unable to delete festival place: ', err);
        return callback(err);
      }

      return callback(null, place);
    });
  }
  catch (e) {
    logger.warn('unable to delete festival place for id: ', festivalId, placeId, e);
    return callback(e);
  }
};

var getFestivalPlaces = function getFestivalPlaces(id, searchRequest, options, callback) {
  logger.debug('getFestivalPlaces: ', id, searchRequest);

  try {
    provider.getFestivalPlaces(id, searchRequest, function (err, festivalPlaces) {

      if (err) {
        logger.debug('Unable to get festival places: ', err);
        return callback(err);
      }

      return callback(null, festivalPlaces);
    });
  }
  catch (e) {
    logger.warn('unable to get festival places for: ', id, searchRequest, e);
    return callback(e);
  }
};

var createFestivalCategory = function createFestivalCategory(festivalId, newCategory, options, callback) {
  logger.debug('createFestivalCategory: ', festivalId, newCategory);

  try {
    provider.createFestivalCategory(festivalId, newCategory, function (err, category) {

      if (err) {
        logger.debug('Unable to create festival category: ', festivalId, newCategory, err);
        return callback(err);
      }

      categoryBreadcrumbs.updateBreadcrumbs(festivalId, category);

      return callback(null, category);
    });
  }
  catch (e) {
    logger.warn('unable to create festival: ', e);
    return callback(e);
  }
};

var updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, options, callback) {
  logger.debug('updateFestivalCategory: ', festivalId, categoryId, newCategory);

  try {
    provider.updateFestivalCategory(festivalId, categoryId, newCategory, function (err, festival) {

      if (err) {
        logger.debug('Unable to update festival category: ', newCategory, err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('unable to update festival category: ', e);
    return callback(e);
  }
};

var getFestivalCategory = function getFestivalCategory(festivalId, categoryId, options, callback) {
  logger.debug('getFestivalCategory: ', festivalId, categoryId);

  try {
    provider.getFestivalCategory(festivalId, categoryId, function (err, category) {

      if (err) {
        logger.debug('Unable to get festival category: ', err);
        return callback(err);
      }

      return callback(null, category);
    });
  }
  catch (e) {
    logger.warn('unable to get festival category for id: ', festivalId, categoryId, e);
    return callback(e);
  }
};

var deleteFestivalCategory = function deleteFestivalCategory(festivalId, categoryId, options, callback) {
  logger.debug('deleteFestivalCategory: ', festivalId, categoryId);

  try {
    provider.deleteFestivalCategory(festivalId, categoryId, function (err, category) {

      if (err) {
        logger.debug('Unable to delete festival category: ', err);
        return callback(err);
      }

      return callback(null, category);
    });
  }
  catch (e) {
    logger.warn('unable to delete festival category for id: ', festivalId, categoryId, e);
    return callback(e);
  }
};

var getFestivalCategories = function getFestivalCategories(id, searchRequest, options, callback) {
  logger.debug('getFestivalCategories: ', id, searchRequest);

  try {
    provider.getFestivalCategories(id, searchRequest, function (err, festivalCategories) {

      if (err) {
        logger.debug('Unable to get festival categories: ', err);
        return callback(err);
      }

      return callback(null, festivalCategories);
    });
  }
  catch (e) {
    logger.warn('unable to get festival categories for: ', id, searchRequest, e);
    return callback(e);
  }
};

module.exports = {
  VERSION: meta.VERSION,
  createFestival: createFestival,
  updateFestival: updateFestival,
  getFestival: getFestival,
  getFestivals: getFestivals,
  deleteFestival: deleteFestival,
  createFestivalEvent: createFestivalEvent,
  updateFestivalEvent: updateFestivalEvent,
  getFestivalEvent: getFestivalEvent,
  getFestivalEvents: getFestivalEvents,
  deleteFestivalEvent: deleteFestivalEvent,
  createFestivalPlace: createFestivalPlace,
  updateFestivalPlace: updateFestivalPlace,
  getFestivalPlace: getFestivalPlace,
  getFestivalPlaces: getFestivalPlaces,
  deleteFestivalPlace: deleteFestivalPlace,
  createFestivalCategory: createFestivalCategory,
  updateFestivalCategory: updateFestivalCategory,
  getFestivalCategory: getFestivalCategory,
  getFestivalCategories: getFestivalCategories,
  deleteFestivalCategory: deleteFestivalCategory
};

var categoryBreadcrumbs = new CategoryBreadcrumbs(module.exports);
var placeBreadcrumbs = new PlaceBreadcrumbs(module.exports);

categoryBreadcrumbs.rebuild(function (err, result) {

});

placeBreadcrumbs.rebuild(function (err, result) {

});
