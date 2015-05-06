var config = require('config');
var Firebase = require('firebase');
var logger = require('../logger/logger').logger;

var festivalsModel = require('festivals-model');
var FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;
var FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;
var ServiceUnavailableError = festivalsModel.error.ServiceUnavailableError;

var myRootRef = new Firebase(config.provider.firebase.url);
var _festivalsRef = myRootRef.child('festivals');
var _festivalsEventsRef = myRootRef.child('festivals-events');
var _festivalsPlacesRef = myRootRef.child('festivals-places');

var changeFestivalCounter = function (change) {
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

var createFestival = function (newFestival, callback) {
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

var createFestivalPlace = function (festivalId, newPlace, callback) {
  logger.debug('firebase.createFestivalPlace: ', festivalId, newPlace);
  var id = newPlace.id;

  //TODO festivalId CHECK

  var newPlaceRef = _festivalsPlacesRef.child(festivalId).child('places').child(id);
  newPlaceRef.set(newPlace, function (error) {

    if (error) {
      logger.warn('Unable to add festival place', error);
      return callback(new ServiceUnavailableError('Unable to add festival place'));
    }

    changeFestivalPlaceCounter(festivalId, +1);

    return callback(null, newPlace);
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

module.exports = {
  createFestivalPlace: createFestivalPlace,
  createFestival: createFestival,
  getFestivals: getFestivals,
  getFestival: getFestival,
  createFestivalEvent: createFestivalEvent,
  getFestivalEvents: getFestivalEvents,
  getFestivalEvent: getFestivalEvent
};