var meta = require('./meta');
var logger = require('./logger/logger').logger;
var provider = require('./provider/provider').getProvider();

var createFestival = function createFestival(newFestival, options, callback) {
  logger.args('createFestival: ', arguments);

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
  logger.args('updateFestival: ', arguments);

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
  logger.args('getFestival: ', arguments);

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

var getFestivals = function getFestivals(searchRequest, options, callback) {
  logger.args('getFestival: ', arguments);

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
  logger.args('createFestivalEvent: ', arguments);

  try {
    provider.createFestivalEvent(festivalId, newEvent, function (err, event) {

      if (err) {
        logger.debug('Unable to create festival event: ', festivalId, newEvent, err);
        return callback(err);
      }

      return callback(null, event);
    });
  }
  catch (e) {
    logger.warn('unable to create festival: ', e);
    return callback(e);
  }
};

var updateFestivalEvent = function updateFestivalEvent(festivalId, eventId, newEvent, options, callback) {
  logger.args('updateFestivalEvent: ', arguments);

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
  logger.args('getFestivalEvent: ', arguments);

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

var getFestivalEvents = function getFestivalEvents(id, searchRequest, options, callback) {
  logger.args('getFestivalEvents: ', arguments);

  try {
    provider.getFestivalEvents(id, searchRequest, function (err, festivalEvents) {

      if (err) {
        logger.debug('Unable to get festival events: ', err);
        return callback(err);
      }

      return callback(null, festivalEvents);
    });
  }
  catch (e) {
    logger.warn('unable to get festival events for: ', id, searchRequest, e);
    return callback(e);
  }
};

var createFestivalPlace = function createFestivalPlace(festivalId, newPlace, options, callback) {
  logger.args('createFestivalPlace: ', arguments);

  try {
    provider.createFestivalPlace(festivalId, newPlace, function (err, place) {

      if (err) {
        logger.debug('Unable to create festival place: ', festivalId, newPlace, err);
        return callback(err);
      }

      return callback(null, place);
    });
  }
  catch (e) {
    logger.warn('unable to create festival: ', e);
    return callback(e);
  }
};

var updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, options, callback) {
  logger.args('updateFestivalPlace: ', arguments);

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
  logger.args('getFestivalPlace: ', arguments);

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

var getFestivalPlaces = function getFestivalPlaces(id, searchRequest, options, callback) {
  logger.args('getFestivalPlaces: ', arguments);

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
  logger.args('createFestivalCategory: ', arguments);

  try {
    provider.createFestivalCategory(festivalId, newCategory, function (err, category) {

      if (err) {
        logger.debug('Unable to create festival category: ', festivalId, newCategory, err);
        return callback(err);
      }

      return callback(null, category);
    });
  }
  catch (e) {
    logger.warn('unable to create festival: ', e);
    return callback(e);
  }
};

var updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, options, callback) {
  logger.args('updateFestivalCategory: ', arguments);

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
  logger.args('getFestivalCategory: ', arguments);

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

var getFestivalCategories = function getFestivalCategories(id, searchRequest, options, callback) {
  logger.args('getFestivalCategories: ', arguments);

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
  createFestivalEvent: createFestivalEvent,
  updateFestivalEvent: updateFestivalEvent,
  getFestivalEvent: getFestivalEvent,
  getFestivalEvents: getFestivalEvents,
  createFestivalPlace: createFestivalPlace,
  updateFestivalPlace: updateFestivalPlace,
  getFestivalPlace: getFestivalPlace,
  getFestivalPlaces: getFestivalPlaces,
  createFestivalCategory: createFestivalCategory,
  updateFestivalCategory: updateFestivalCategory,
  getFestivalCategory: getFestivalCategory,
  getFestivalCategories: getFestivalCategories
};