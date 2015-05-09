var meta = require('./meta');
var logger = require('./logger/logger').logger;

//var provider = require('./provider/provider').getProvider();
//var provider = require('./provider/elasticsearch');
var provider = require('./provider/fireabase');

var createFestival = function createFestival(newFestival, options, callback) {
  logger.debug('createFestival: ', newFestival);

  try {
    provider.createFestival(newFestival, function (err, festival) {

      if (err) {
        logger.debug('createFestival: Unable to create festival: ', festival, err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('createFestival: unable to create festival: ', e);
    return callback(e);
  }
};

var updateFestival = function updateFestival(festivalId, newFestival, options, callback) {
  logger.debug('updateFestival: ', festivalId, newFestival);

  try {
    provider.updateFestival(festivalId, newFestival, function (err, festival) {

      if (err) {
        logger.debug('updateFestival: Unable to update festival: ', newFestival, err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('updateFestival: unable to update festival: ', e);
    return callback(e);
  }
};

var getFestival = function getFestival(id, options, callback) {
  logger.debug('getFestival: ', id);

  try {
    provider.getFestival(id, function (err, festival) {

      if (err) {
        logger.debug('getFestival: Unable to get festival: ', err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('getFestival: unable to get festival for id: ', id, e);
    return callback(e);
  }
};

var getFestivals = function getFestivals(searchFestivalsRequest, options, callback) {
  logger.debug('getFestivals: ', searchFestivalsRequest);

  try {
    provider.getFestivals(searchFestivalsRequest, function (err, festivals) {

      if (err) {
        logger.debug('getFestivals: Unable to get festivals: ', err);
        return callback(err);
      }

      return callback(null, festivals);
    });
  }
  catch (e) {
    logger.warn('getFestivals: unable to get festivals for: ', searchFestivalsRequest, e);
    return callback(e);
  }
};

var createFestivalEvent = function createFestivalEvent(festivalId, newEvent, options, callback) {
  logger.debug('createFestivalEvent: ', festivalId, newEvent);

  try {
    provider.createFestivalEvent(festivalId, newEvent, function (err, event) {

      if (err) {
        logger.debug('createFestivalEvent: Unable to create festival event: ', festivalId, newEvent, err);
        return callback(err);
      }

      return callback(null, event);
    });
  }
  catch (e) {
    logger.warn('createFestivalEvent: unable to create festival: ', e);
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
        logger.debug('getFestivalEvent: Unable to get festival event: ', err);
        return callback(err);
      }

      return callback(null, event);
    });
  }
  catch (e) {
    logger.warn('getFestivalEvent: unable to get festival event for id: ', festivalId, eventId, e);
    return callback(e);
  }
};

var getFestivalEvents = function getFestivalEvents(id, searchFestivalEventsRequest, options, callback) {
  logger.debug('getFestivalEvents: ', id, searchFestivalEventsRequest);

  try {
    provider.getFestivalEvents(id, searchFestivalEventsRequest, function (err, festivalEvents) {

      if (err) {
        logger.debug('getFestivalEvents: Unable to get festival events: ', err);
        return callback(err);
      }

      return callback(null, festivalEvents);
    });
  }
  catch (e) {
    logger.warn('getFestivalEvents: unable to get festival events for: ', id, searchFestivalEventsRequest, e);
    return callback(e);
  }
};

var createFestivalPlace = function createFestivalPlace(festivalId, newPlace, options, callback) {
  logger.debug('createFestivalPlace: ', festivalId, newPlace);

  try {
    provider.createFestivalPlace(festivalId, newPlace, function (err, place) {

      if (err) {
        logger.debug('createFestivalPlace: Unable to create festival place: ', festivalId, newPlace, err);
        return callback(err);
      }

      return callback(null, place);
    });
  }
  catch (e) {
    logger.warn('createFestivalPlace: unable to create festival: ', e);
    return callback(e);
  }
};

var updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, options, callback) {
  logger.debug('updateFestivalPlace: ', festivalId, placeId, newPlace);

  try {
    provider.updateFestivalPlace(festivalId, placeId, newPlace, function (err, festival) {

      if (err) {
        logger.debug('updateFestivalPlace: Unable to update festival place: ', newPlace, err);
        return callback(err);
      }

      return callback(null, festival);
    });
  }
  catch (e) {
    logger.warn('updateFestivalPlace: unable to update festival place: ', e);
    return callback(e);
  }
};

var getFestivalPlace = function getFestivalPlace(festivalId, placeId, options, callback) {
  logger.debug('getFestivalPlace: ', festivalId, placeId);

  try {
    provider.getFestivalPlace(festivalId, placeId, function (err, place) {

      if (err) {
        logger.debug('getFestivalPlace: Unable to get festival place: ', err);
        return callback(err);
      }

      return callback(null, place);
    });
  }
  catch (e) {
    logger.warn('getFestivalPlace: unable to get festival place for id: ', festivalId, placeId, e);
    return callback(e);
  }
};

var getFestivalPlaces = function getFestivalPlaces(id, searchFestivalPlacesRequest, options, callback) {
  logger.debug('getFestivalPlaces: ', id, searchFestivalPlacesRequest);

  try {
    provider.getFestivalPlaces(id, searchFestivalPlacesRequest, function (err, festivalPlaces) {

      if (err) {
        logger.debug('getFestivalPlaces: Unable to get festival places: ', err);
        return callback(err);
      }

      return callback(null, festivalPlaces);
    });
  }
  catch (e) {
    logger.warn('getFestivalPlaces: unable to get festival places for: ', id, searchFestivalPlacesRequest, e);
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
  getFestivalPlaces: getFestivalPlaces
};