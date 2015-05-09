var config = require('config');
var Firebase = require('firebase');
var extend = require('util')._extend;
var logger = require('../logger/logger').logger;

var festivalsModel = require('festivals-model');
var FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;
var FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;
var FestivalPlaceNotFoundError = festivalsModel.error.FestivalPlaceNotFoundError;
var ServiceUnavailableError = festivalsModel.error.ServiceUnavailableError;

var myRootRef = new Firebase(config.provider.firebase.url);
var _festivalsRef = myRootRef.child('festivals');
var _festivalsEventsRef = myRootRef.child('festivals-events');
var _festivalsPlacesRef = myRootRef.child('festivals-places');
var _festivalsCategoriesRef = myRootRef.child('festivals-categories');

var changeFestivalCounter = function changeFestivalCounter(change) {
  _festivalsRef.child('counter').transaction(function updateFunction(counter) {
      return (counter || 0) + change;
    },
    function onComplete(error, committed, snapshot) {
      if (error) {
        logger.warn('firebase.changeFestivalCounter: ', error);
      } else if (!committed) {
        logger.debug('firebase.changeFestivalCounter: skip');
      }

      logger.debug('firebase.changeFestivalCounter: ', snapshot.val());
    });
};

var createFestival = function createFestival(newFestival, callback) {
  logger.debug('firebase.createFestival: ', newFestival);
  var festivalId = newFestival.id;

  var newFestivalRef = _festivalsRef.child('festivals').child(festivalId);
  newFestivalRef.set(newFestival, function (error) {

    if (error) {
      logger.warn('Unable to add festival', error);
      return callback(new ServiceUnavailableError('Unable to add festival'));
    }

    changeFestivalCounter(+1);

    return callback(null, newFestival);
  });
};

var updateFestival = function updateFestival(festivalId, newFestival, callback) {
  logger.debug('firebase.updateFestival: ', festivalId, newFestival);

  _festivalsRef.child('festivals').child(festivalId).transaction(function updateFunction(data) {
      if (data) {
        newFestival = extend(data, newFestival);
      }

      return newFestival;
    },
    function onComplete(error, committed, snapshot) {

      if (error) {
        logger.warn('firebase.updateFestival: ', error);
        return callback(new ServiceUnavailableError('Unable to add festival'));
      }

      if (!committed) {
        logger.debug('firebase.updateFestival: skip');
      }

      logger.debug('firebase.updateFestival: ', snapshot.val());
      return callback(error, snapshot.val());
    });
};

var getFestival = function (festivalId, callback) {
  logger.debug('firebase.getFestival: ', festivalId);

  _festivalsRef.child('festivals').child(festivalId).once('value',
    function onSuccess(snapshot) {

      if (!snapshot.exists()) {
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      return callback(null, snapshot.val());
    },
    function onAuthError(err) {
      logger.warn('firebase.getFestival.onAuthError: ', err);
      return callback(new ServiceUnavailableError('Forbidden access'));
    });
};

var getFestivals = function (searchFestivalsRequest, callback) {
  logger.debug('firebase.getFestivals: ', searchFestivalsRequest);

  var results = {
    total: 0,
    festivals: []
  };

  _festivalsRef.child('counter').once('value',
    function onSuccess(totalSnapshot) {

      results.total = totalSnapshot.val();

      var queryRef = _festivalsRef
        .child('festivals');

      if (searchFestivalsRequest.limit > 0) {
        queryRef = queryRef.limitToFirst(searchFestivalsRequest.limit);
      }

      queryRef.once('value',
        function (snapshot) {
          var festivals = [];

          snapshot.forEach(function (childSnapshot) {
            festivals.push(childSnapshot.val());
          });

          results.festivals = festivals;

          return callback(null, results);
        },
        function onAuthError(err) {
          logger.warn('firebase.getFestivals.onAuthError: ', err);
          return callback(new ServiceUnavailableError('Forbidden access'));
        }
      );
    },
    function onAuthError(err) {
      logger.warn('firebase.getFestivals.onAuthError: ', err);
      return callback(new ServiceUnavailableError('Forbidden access'));
    }
  );
};

var changeFestivalEventsCounter = function (festivalId, change) {
  _festivalsEventsRef.child(festivalId).child('counter').transaction(function updateFunction(counter) {
      return (counter || 0) + change;
    },
    function onComplete(error, committed, snapshot) {
      if (error) {
        logger.warn('firebase.changeFestivalEventsCounter: ', error);
      } else if (!committed) {
        logger.debug('firebase.changeFestivalEventsCounter: skip');
      }

      logger.debug('firebase.changeFestivalEventsCounter: ', snapshot.val());
    });
};

var createFestivalEvent = function (festivalId, newEvent, callback) {
  logger.debug('firebase.createFestivalEvent: ', festivalId, newEvent);
  var id = newEvent.id;

  getFestival(festivalId, function (err, festival) {
    logger.debug('firebase.createFestivalEvent: getFestival', festival);

    if (err || !festival) {
      logger.debug(err);
      return callback(new FestivalNotFoundError('Festival not found'));
    }

    var newEventRef = _festivalsEventsRef.child(festivalId).child('events').child(id);
    newEventRef.set(newEvent, function (error) {

      if (error) {
        logger.warn('Unable to add festival', error);
        return callback(new ServiceUnavailableError('Unable to add festival'));
      }

      changeFestivalEventsCounter(festivalId, +1);

      return callback(null, newEvent);
    });
  });
};

var updateFestivalEvent = function updateFestivalEvent(festivalId, eventId, newEvent, callback) {
  logger.debug('firebase.updateFestivalEvent: ', festivalId, newEvent);

  _festivalsEventsRef.child(festivalId).child('events').child(eventId).transaction(function updateFunction(data) {
      if (data) {
        newEvent = extend(data, newEvent);
      }

      return newEvent;
    },
    function onComplete(error, committed, snapshot) {

      if (error) {
        logger.warn('firebase.updateFestivalEvent: ', error);
        return callback(new ServiceUnavailableError('Unable to update festival event'));
      }

      if (!committed) {
        logger.debug('firebase.updateFestivalEvent: skip');
      }

      logger.debug('firebase.updateFestivalEvent: ', snapshot.val());
      return callback(error, snapshot.val());
    });
};

var getFestivalEvents = function (festivalId, searchFestivalEventsRequest, callback) {
  logger.debug('firebase.getFestivalEvents: ', festivalId, searchFestivalEventsRequest);

  var results = {
    total: 0,
    events: []
  };

  _festivalsEventsRef.child(festivalId).child('counter').once('value',
    function onSuccess(totalSnapshot) {

      if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
        return callback(new FestivalNotFoundError('festival not found'));
      }

      results.total = totalSnapshot.val();

      var queryRef = _festivalsEventsRef
        .child(festivalId)
        .child('events');

      if (searchFestivalEventsRequest.limit > 0) {
        queryRef = queryRef.limitToFirst(searchFestivalEventsRequest.limit);
      }

      queryRef.once('value',
        function (snapshot) {
          var events = [];

          snapshot.forEach(function (childSnapshot) {
            events.push(childSnapshot.val());
          });

          results.events = events;

          return callback(null, results);
        },
        function onAuthError(err) {
          logger.warn('firebase.getFestivalEvents.onAuthError: ', err);
          return callback(new ServiceUnavailableError('Forbidden access'));
        }
      );
    },
    function onAuthError(err) {
      logger.warn('firebase.getFestivalEvents.onAuthError: ', err);
      return callback(new ServiceUnavailableError('Forbidden access'));
    }
  );
};

var getFestivalEvent = function (festivalId, eventId, callback) {
  logger.debug('firebase.getFestivalEvent: ', festivalId, eventId);

  _festivalsEventsRef.child(festivalId).child('events').child(eventId).once('value',
    function onSuccess(snapshot) {

      if (!snapshot.exists()) {
        return callback(new FestivalEventNotFoundError('Festival event not found'));
      }

      return callback(null, snapshot.val());
    },
    function onAuthError(err) {
      logger.warn('firebase.getFestivalEvent.onAuthError: ', err);
      return callback(new ServiceUnavailableError('Forbidden access'));
    });
};

var createFestivalPlace = function createFestivalPlace(festivalId, newPlace, callback) {
  logger.debug('firebase.createFestivalPlace: ', festivalId, newPlace);
  var id = newPlace.id;

  getFestival(festivalId, function (err, festival) {
    logger.debug('firebase.createFestivalPlace: getFestival', festival);

    if (err || !festival) {
      logger.debug(err);
      return callback(new FestivalNotFoundError('Festival place not found'));
    }

    var newPlaceRef = _festivalsPlacesRef.child(festivalId).child('places').child(id);
    newPlaceRef.set(newPlace, function (error) {

      if (error) {
        logger.warn('Unable to add festival place', error);
        return callback(new ServiceUnavailableError('Unable to add festival place'));
      }

      changeFestivalPlaceCounter(festivalId, +1);

      return callback(null, newPlace);
    });
  });
};

var changeFestivalPlaceCounter = function (festivalId, change) {
  _festivalsPlacesRef.child(festivalId).child('counter').transaction(function updateFunction(counter) {
      return (counter || 0) + change;
    },
    function onComplete(error, committed, snapshot) {
      if (error) {
        logger.warn('firebase.changeFestivalPlaceCounter: ', error);
      } else if (!committed) {
        logger.debug('firebase.changeFestivalPlaceCounter: skip');
      }

      logger.debug('firebase.changeFestivalPlaceCounter: ', snapshot.val());
    });
};

var updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, callback) {
  logger.debug('firebase.updateFestivalPlace: ', festivalId, newPlace);

  _festivalsPlacesRef.child(festivalId).child('places').child(placeId).transaction(function updateFunction(data) {
      if (data) {
        newPlace = extend(data, newPlace);
      }

      return newPlace;
    },
    function onComplete(error, committed, snapshot) {

      if (error) {
        logger.warn('firebase.updateFestivalPlace: ', error);
        return callback(new ServiceUnavailableError('Unable to update festival place'));
      }

      if (!committed) {
        logger.debug('firebase.updateFestivalPlace: skip');
      }

      logger.debug('firebase.updateFestivalPlace: ', snapshot.val());
      return callback(error, snapshot.val());
    });
};

var getFestivalPlaces = function (festivalId, searchFestivalPlacesRequest, callback) {
  logger.debug('firebase.getFestivalPlaces: ', festivalId, searchFestivalPlacesRequest);

  var results = {
    total: 0,
    places: []
  };

  _festivalsPlacesRef.child(festivalId).child('counter').once('value',
    function onSuccess(totalSnapshot) {

      if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
        return callback(new FestivalNotFoundError('festival not found'));
      }

      results.total = totalSnapshot.val();

      var queryRef = _festivalsPlacesRef
        .child(festivalId)
        .child('places');

      if (searchFestivalPlacesRequest.limit > 0) {
        queryRef = queryRef.limitToFirst(searchFestivalPlacesRequest.limit);
      }

      queryRef.once('value',
        function (snapshot) {
          var places = [];

          snapshot.forEach(function (childSnapshot) {
            places.push(childSnapshot.val());
          });

          results.places = places;

          return callback(null, results);
        },
        function onAuthError(err) {
          logger.warn('firebase.getFestivalPlaces.onAuthError: ', err);
          return callback(new ServiceUnavailableError('Forbidden access'));
        }
      );
    },
    function onAuthError(err) {
      logger.warn('firebase.getFestivalPlaces.onAuthError: ', err);
      return callback(new ServiceUnavailableError('Forbidden access'));
    }
  );
};

var getFestivalPlace = function (festivalId, placeId, callback) {
  logger.debug('firebase.getFestivalPlace: ', festivalId, placeId);

  _festivalsPlacesRef.child(festivalId).child('places').child(placeId).once('value',
    function onSuccess(snapshot) {

      if (!snapshot.exists()) {
        return callback(new FestivalPlaceNotFoundError('Festival place not found'));
      }

      return callback(null, snapshot.val());
    },
    function onAuthError(err) {
      logger.warn('firebase.getFestivalPlace.onAuthError: ', err);
      return callback(new ServiceUnavailableError('Forbidden access'));
    });
};

var createFestivalCategory = function createFestivalCategory(festivalId, newCategory, callback) {
  logger.debug('firebase.createFestivalCategory: ', festivalId, newCategory);
  var id = newCategory.id;

  getFestival(festivalId, function (err, festival) {
    logger.debug('firebase.createFestivalCategory: getFestival', festival);

    if (err || !festival) {
      logger.debug(err);
      return callback(new FestivalNotFoundError('Festival category not found'));
    }

    var newCategoryRef = _festivalsCategoriesRef.child(festivalId).child('categories').child(id);
    newCategoryRef.set(newCategory, function (error) {

      if (error) {
        logger.warn('Unable to add festival category', error);
        return callback(new ServiceUnavailableError('Unable to add festival category'));
      }

      changeFestivalCategoryCounter(festivalId, +1);

      return callback(null, newCategory);
    });
  });
};

var changeFestivalCategoryCounter = function (festivalId, change) {
  _festivalsCategoriesRef.child(festivalId).child('counter').transaction(function updateFunction(counter) {
      return (counter || 0) + change;
    },
    function onComplete(error, committed, snapshot) {
      if (error) {
        logger.warn('firebase.changeFestivalCategoryCounter: ', error);
      } else if (!committed) {
        logger.debug('firebase.changeFestivalCategoryCounter: skip');
      }

      logger.debug('firebase.changeFestivalCategoryCounter: ', snapshot.val());
    });
};

var updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, callback) {
  logger.debug('firebase.updateFestivalCategory: ', festivalId, newCategory);

  _festivalsCategoriesRef.child(festivalId).child('categories').child(categoryId).transaction(function updateFunction(data) {
      if (data) {
        newCategory = extend(data, newCategory);
      }

      return newCategory;
    },
    function onComplete(error, committed, snapshot) {

      if (error) {
        logger.warn('firebase.updateFestivalCategory: ', error);
        return callback(new ServiceUnavailableError('Unable to update festival category'));
      }

      if (!committed) {
        logger.debug('firebase.updateFestivalCategory: skip');
      }

      logger.debug('firebase.updateFestivalCategory: ', snapshot.val());
      return callback(error, snapshot.val());
    });
};

var getFestivalCategories = function (festivalId, searchFestivalCategoriesRequest, callback) {
  logger.debug('firebase.getFestivalCategories: ', festivalId, searchFestivalCategoriesRequest);

  var results = {
    total: 0,
    categories: []
  };

  _festivalsCategoriesRef.child(festivalId).child('counter').once('value',
    function onSuccess(totalSnapshot) {

      if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
        return callback(new FestivalNotFoundError('festival not found'));
      }

      results.total = totalSnapshot.val();

      var queryRef = _festivalsCategoriesRef
        .child(festivalId)
        .child('categories');

      if (searchFestivalCategoriesRequest.limit > 0) {
        queryRef = queryRef.limitToFirst(searchFestivalCategoriesRequest.limit);
      }

      queryRef.once('value',
        function (snapshot) {
          var categories = [];

          snapshot.forEach(function (childSnapshot) {
            categories.push(childSnapshot.val());
          });

          results.categories = categories;

          return callback(null, results);
        },
        function onAuthError(err) {
          logger.warn('firebase.getFestivalCategories.onAuthError: ', err);
          return callback(new ServiceUnavailableError('Forbidden access'));
        }
      );
    },
    function onAuthError(err) {
      logger.warn('firebase.getFestivalCategories.onAuthError: ', err);
      return callback(new ServiceUnavailableError('Forbidden access'));
    }
  );
};

var getFestivalCategory = function (festivalId, categoryId, callback) {
  logger.debug('firebase.getFestivalCategory: ', festivalId, categoryId);

  _festivalsCategoriesRef.child(festivalId).child('categories').child(categoryId).once('value',
    function onSuccess(snapshot) {

      if (!snapshot.exists()) {
        return callback(new FestivalCategoryNotFoundError('Festival category not found'));
      }

      return callback(null, snapshot.val());
    },
    function onAuthError(err) {
      logger.warn('firebase.getFestivalCategory.onAuthError: ', err);
      return callback(new ServiceUnavailableError('Forbidden access'));
    });
};

module.exports = {
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
};