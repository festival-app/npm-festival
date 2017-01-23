'use strict';

var extend = require('util')._extend;
var logger = require('../logger/logger').logger;

var festivalsModel = require('festivals-model');
var FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;
var FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;
var FestivalPlaceNotFoundError = festivalsModel.error.FestivalPlaceNotFoundError;
var NewsNotFoundError = festivalsModel.error.NewsNotFoundError;
var FestivalCategoryNotFoundError = festivalsModel.error.FestivalCategoryNotFoundError;
var ServiceUnavailableError = festivalsModel.error.ServiceUnavailableError;

module.exports.provider = function provider(db) {
  var _festivalsRef = db.ref('festivals');
  var _festivalsEventsRef = db.ref('festivals-events');
  var _festivalsPlacesRef = db.ref('festivals-places');
  var _festivalsCategoriesRef = db.ref('festivals-categories');
  var _newsRef = db.ref('news');

  var changeFestivalCategoryCounter = function changeFestivalCategoryCounter(festivalId, change) {
    return _festivalsCategoriesRef
      .child(festivalId)
      .child('counter')
      .transaction(function updateFunction(counter) {
        return (counter || 0) + change;
      },
      function onComplete(error, committed, snapshot) {
        if (error) {
          logger.warn('firebase.changeFestivalCategoryCounter: ', error);
        } else if (!committed) {
          logger.info('firebase.changeFestivalCategoryCounter: skip');
        }

        var val = snapshot.val();
        logger.debug('firebase.changeFestivalCategoryCounter: ', val);

        if (val < 1) {
          return _festivalsCategoriesRef
            .child(festivalId)
            .child('counter')
            .remove(
            function onCompleteCounter(errorCounter) {

              if (errorCounter) {
                logger.warn('firebase.changeFestivalCategoryCounter: ', errorCounter);
              }
            });
        }

        return false;
      });
  };

  var changeFestivalPlaceCounter = function changeFestivalPlaceCounter(festivalId, change) {
    return _festivalsPlacesRef
      .child(festivalId)
      .child('counter')
      .transaction(function updateFunction(counter) {
        return (counter || 0) + change;
      },
      function onComplete(error, committed, snapshot) {
        if (error) {
          logger.warn('firebase.changeFestivalPlaceCounter: ', error);
        } else if (!committed) {
          logger.info('firebase.changeFestivalPlaceCounter: skip');
        }

        var val = snapshot.val();
        logger.debug('firebase.changeFestivalPlaceCounter: ', val);

        if (val < 1) {
          return _festivalsPlacesRef
            .child(festivalId)
            .child('counter')
            .remove(
            function onCompleteCounter(errorCounter) {

              if (errorCounter) {
                logger.warn('firebase.changeFestivalPlaceCounter: ', errorCounter);
              }
            });
        }

        return false;
      });
  };

  var changeFestivalCounter = function changeFestivalCounter(change) {
    return _festivalsRef
      .child('counter')
      .transaction(function updateFunction(counter) {
        return (counter || 0) + change;
      },
      function onComplete(error, committed, snapshot) {
        if (error) {
          logger.warn('firebase.changeFestivalCounter: ', error);
        } else if (!committed) {
          logger.info('firebase.changeFestivalCounter: skip');
        }

        var val = snapshot.val();
        logger.debug('firebase.changeFestivalCounter: ', val);

        if (val < 1) {
          return _festivalsRef
            .child('counter')
            .remove(
            function onCompleteCounter(errorCounter) {

              if (errorCounter) {
                logger.warn('firebase.changeFestivalCounter: ', errorCounter);
              }
            });
        }
        return false;
      });
  };

  var changeNewsCounter = function changeNewsCounter(festivalId, change) {
    return _newsRef
      .child(festivalId)
      .child('counter')
      .transaction(function updateFunction(counter) {
        return (counter || 0) + change;
      },
      function onComplete(error, committed, snapshot) {
        if (error) {
          logger.warn('firebase.changeNewsCounter: ', error);
        } else if (!committed) {
          logger.debug('firebase.changeNewsCounter: skip');
        }

        var val = snapshot.val();
        logger.debug('firebase.changeNewsCounter: ', val);

        if (val < 1) {
          return _newsRef
            .child(festivalId)
            .child('counter')
            .remove(
            function onCompleteCounter(errorCounter) {

              if (errorCounter) {
                logger.warn('firebase.changeNewsCounter: ', errorCounter);
              }
            });
        }
        return false;
      });
  };

  var changeFestivalEventsCounter = function changeFestivalEventsCounter(festivalId, change) {
    return _festivalsEventsRef
      .child(festivalId)
      .child('counter')
      .transaction(function updateFunction(counter) {
        return (counter || 0) + change;
      },
      function onComplete(error, committed, snapshot) {
        if (error) {
          logger.warn('firebase.changeFestivalEventsCounter: ', error);
        } else if (!committed) {
          logger.debug('firebase.changeFestivalEventsCounter: skip');
        }

        var val = snapshot.val();
        logger.debug('firebase.changeFestivalEventsCounter: ', val);

        if (val < 1) {
          return _festivalsEventsRef
            .child(festivalId)
            .child('counter')
            .remove(
            function onCompleteCounter(errorCounter) {

              if (errorCounter) {
                logger.warn('firebase.changeFestivalEventsCounter: ', errorCounter);
              }
            });
        }
        return false;
      });
  };

  var createFestival = function createFestival(newFestival, callback) {
    logger.args('createFestival: ', arguments);

    var festivalId = newFestival.id;

    return _festivalsRef
      .child('festivals')
      .child(festivalId)
      .set(newFestival, function (error) {

        if (error) {
          logger.warn('Unable to add festival', error);
          return callback(new ServiceUnavailableError('Unable to add festival'));
        }

        changeFestivalCounter(+1);

        return callback(null, newFestival);
      });
  };

  var updateFestival = function updateFestival(festivalId, newFestival, callback) {
    logger.args('updateFestival: ', arguments);

    return _festivalsRef
      .child('festivals')
      .child(festivalId)
      .transaction(function updateFunction(data) {
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

  var getFestival = function getFestival(festivalId, callback) {
    logger.args('getFestival: ', arguments);

    return _festivalsRef
      .child('festivals')
      .child(festivalId)
      .once('value',
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

  var deleteFestival = function deleteFestival(festivalId, callback) {
    logger.args('getFestival: ', arguments);

    return _festivalsRef
      .child('festivals')
      .child(festivalId)
      .remove(
      function onCompleteCounter(errorCounter) {

        if (errorCounter) {
          logger.warn('firebase.deleteFestival: ', errorCounter);
          return callback(new FestivalNotFoundError('Festival not found'));
        }

        changeFestivalCounter(-1);

        return callback(null);
      });
  };

  var getFestivals = function getFestivals(searchFestivalsRequest, callback) {
    logger.args('getFestivals: ', arguments);

    var results = {
      total: 0,
      festivals: []
    };

    return _festivalsRef
      .child('counter')
      .once('value',
      function onSuccess(totalSnapshot) {

        results.total = totalSnapshot.val();

        var queryRef = _festivalsRef
          .child('festivals');

        if (searchFestivalsRequest.limit > 0) {
          queryRef = queryRef.limitToFirst(searchFestivalsRequest.limit);
        }

        return queryRef
          .once('value',
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

  var createFestivalEvent = function (festivalId, newEvent, callback) {
    logger.args('createFestivalEvent: ', arguments);

    var id = newEvent.id;

    return getFestival(festivalId, function (err, festival) {
      logger.debug('firebase.createFestivalEvent: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      return _festivalsEventsRef
        .child(festivalId)
        .child('events')
        .child(id)
        .set(newEvent, function (error) {

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
    logger.args('updateFestivalEvent: ', arguments);

    return getFestival(festivalId, function (err, festival) {
      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      return _festivalsEventsRef
        .child(festivalId)
        .child('events')
        .child(eventId)
        .transaction(function updateFunction(data) {
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
    });
  };

  var getFestivalEvents = function (festivalId, searchFestivalEventsRequest, callback) {
    logger.args('getFestivalEvents: ', arguments);

    var results = {
      total: 0,
      events: []
    };

    return _festivalsEventsRef
      .child(festivalId)
      .child('counter')
      .once('value',
      function onSuccess(totalSnapshot) {

        if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
          return callback(new FestivalNotFoundError('Festival not found'));
        }

        results.total = totalSnapshot.val();

        var queryRef = _festivalsEventsRef
          .child(festivalId)
          .child('events');

        if (searchFestivalEventsRequest.limit > 0) {
          queryRef = queryRef.limitToFirst(searchFestivalEventsRequest.limit);
        }

        return queryRef
          .once('value',
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
    logger.args('getFestivalEvent: ', arguments);

    return _festivalsEventsRef
      .child(festivalId)
      .child('events')
      .child(eventId)
      .once('value',
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

  var deleteFestivalEvent = function deleteFestivalEvent(festivalId, eventId, callback) {
    logger.args('deleteFestivalEvent: ', arguments);

    return _festivalsEventsRef
      .child(festivalId)
      .child('events')
      .child(eventId)
      .remove(
      function onCompleteCounter(errorCounter) {

        if (errorCounter) {
          logger.warn('firebase.deleteFestivalEvent: ', errorCounter);
          return callback(new FestivalEventNotFoundError('Festival event not found'));
        }

        changeFestivalEventsCounter(festivalId, -1);
        return callback(null);
      });
  };

  var createFestivalPlace = function createFestivalPlace(festivalId, newPlace, callback) {
    logger.args('createFestivalPlace: ', arguments);

    var id = newPlace.id;

    return getFestival(festivalId, function (err, festival) {
      logger.debug('firebase.createFestivalPlace: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      return _festivalsPlacesRef
        .child(festivalId)
        .child('places')
        .child(id)
        .set(newPlace, function (error) {

          if (error) {
            logger.warn('Unable to add festival place', error);
            return callback(new ServiceUnavailableError('Unable to add festival place'));
          }

          changeFestivalPlaceCounter(festivalId, +1);

          return callback(null, newPlace);
        });
    });
  };

  var updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, callback) {
    logger.args('updateFestivalPlace: ', arguments);

    return _festivalsPlacesRef
      .child(festivalId)
      .child('places')
      .child(placeId)
      .transaction(function updateFunction(data) {
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
    logger.args('getFestivalPlaces: ', arguments);

    var results = {
      total: 0,
      places: []
    };

    return _festivalsPlacesRef
      .child(festivalId)
      .child('counter')
      .once('value',
      function onSuccess(totalSnapshot) {

        if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
          return callback(new FestivalNotFoundError('Festival not found'));
        }

        results.total = totalSnapshot.val();

        var queryRef = _festivalsPlacesRef
          .child(festivalId)
          .child('places');

        if (searchFestivalPlacesRequest.limit > 0) {
          queryRef = queryRef.limitToFirst(searchFestivalPlacesRequest.limit);
        }

        return queryRef
          .once('value',
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
    logger.args('getFestivalPlace: ', arguments);

    return _festivalsPlacesRef
      .child(festivalId)
      .child('places')
      .child(placeId)
      .once('value',
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

  var deleteFestivalPlace = function deleteFestivalPlace(festivalId, placeId, callback) {
    logger.args('deleteFestivalPlace: ', arguments);

    return _festivalsPlacesRef
      .child(festivalId)
      .child('places')
      .child(placeId)
      .remove(
      function onCompleteCounter(errorCounter) {

        if (errorCounter) {
          logger.warn('firebase.deleteFestivalPlace: ', errorCounter);
          return callback(new FestivalPlaceNotFoundError('Festival place not found'));
        }

        changeFestivalPlaceCounter(festivalId, -1);

        return callback(null);
      });
  };

  var createFestivalCategory = function createFestivalCategory(festivalId, newCategory, callback) {
    logger.args('createFestivalCategory: ', arguments);

    var id = newCategory.id;

    return getFestival(festivalId, function (err, festival) {
      logger.debug('firebase.createFestivalCategory: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      return _festivalsCategoriesRef
        .child(festivalId)
        .child('categories')
        .child(id)
        .set(newCategory, function (error) {

          if (error) {
            logger.warn('Unable to add festival category', error);
            return callback(new ServiceUnavailableError('Unable to add festival category'));
          }

          changeFestivalCategoryCounter(festivalId, +1);

          return callback(null, newCategory);
        });
    });
  };

  var updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, callback) {
    logger.args('updateFestivalCategory: ', arguments);

    return _festivalsCategoriesRef
      .child(festivalId)
      .child('categories')
      .child(categoryId)
      .transaction(function updateFunction(data) {
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
    logger.args('getFestivalCategories: ', arguments);

    var results = {
      total: 0,
      categories: []
    };

    return _festivalsCategoriesRef
      .child(festivalId)
      .child('counter')
      .once('value',
      function onSuccess(totalSnapshot) {

        if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
          return callback(new FestivalNotFoundError('Festival not found'));
        }

        results.total = totalSnapshot.val();

        var queryRef = _festivalsCategoriesRef
          .child(festivalId)
          .child('categories');

        if (searchFestivalCategoriesRequest.limit > 0) {
          queryRef = queryRef.limitToFirst(searchFestivalCategoriesRequest.limit);
        }

        return queryRef
          .once('value',
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
    logger.args('getFestivalCategory: ', arguments);

    return _festivalsCategoriesRef
      .child(festivalId)
      .child('categories')
      .child(categoryId)
      .once('value',
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

  var deleteFestivalCategory = function deleteFestivalCategory(festivalId, categoryId, callback) {
    logger.args('deleteFestivalCategory: ', arguments);

    return _festivalsCategoriesRef
      .child(festivalId)
      .child('categories')
      .child(categoryId)
      .remove(
      function onCompleteCounter(errorCounter) {

        if (errorCounter) {
          logger.warn('firebase.deleteFestivalCategory: ', errorCounter);
          return callback(new FestivalCategoryNotFoundError('Festival category not found'));
        }

        changeFestivalCategoryCounter(festivalId, -1);

        return callback(null);
      });
  };

  var getNewsCollection = function getNewsCollection(searchRequest, callback) {
    logger.args('getNewsCollection: ', arguments);

    var festivalId = searchRequest.festival;

    var results = {
      total: 0,
      news: []
    };

    return _newsRef
      .child(festivalId)
      .child('counter')
      .once('value',
      function onSuccess(totalSnapshot) {

        if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
          return callback(null, results);
        }

        results.total = totalSnapshot.val();

        var queryRef = _newsRef;

        if (~~searchRequest.limit > 0) {
          queryRef = _newsRef.limitToFirst(~~searchRequest.limit);
        }

        return queryRef
          .once('value',
          function (snapshot) {
            var news = [];

            snapshot.forEach(function (childSnapshot) {
              news.push(childSnapshot.val());
            });

            results.news = news;

            return callback(null, results);
          },
          function onAuthError(err) {
            logger.warn('firebase.getNewsCollection.onAuthError: ', err);
            return callback(new ServiceUnavailableError('Forbidden access'));
          }
        );
      },
      function onAuthError(err) {
        logger.warn('firebase.getNewsCollection.onAuthError: ', err);
        return callback(new ServiceUnavailableError('Forbidden access'));
      }
    );
  };

  var createNews = function createNews(news, callback) {
    logger.args('createNews: ', arguments);

    var id = news.id;

    return _newsRef
      .child(id)
      .set(news, function (error) {

        if (error) {
          logger.warn('Unable to add news', error);
          return callback(new ServiceUnavailableError('Unable to add news'));
        }

        changeNewsCounter(id, +1);

        return callback(null, news);
      });
  };


  var getNews = function getNews(newsId, callback) {
    logger.args('getNews: ', arguments);

    return _newsRef
      .child(newsId)
      .once('value',
      function onSuccess(snapshot) {

        if (!snapshot.exists()) {
          return callback(new NewsNotFoundError('News not found'));
        }

        return callback(null, snapshot.val());
      },
      function onAuthError(err) {
        logger.warn('firebase.getNews.onAuthError: ', err);
        return callback(new ServiceUnavailableError('Forbidden access'));
      });
  };

  var updateNews = function updateNews(newsId, newNews, callback) {
    logger.args('updateNews: ', arguments);

    return _newsRef
      .child(newsId)
      .transaction(function updateFunction(data) {
        if (data) {
          newNews = extend(data, newNews);
        }

        return newNews;
      },
      function onComplete(error, committed, snapshot) {

        if (error) {
          logger.warn('firebase.updateNews: ', error);
          return callback(new ServiceUnavailableError('Unable to update news'));
        }

        if (!committed) {
          logger.debug('firebase.updateNews: skip');
        }

        logger.debug('firebase.updateNews: ', snapshot.val());
        return callback(error, snapshot.val());
      });
  };

  var deleteNews = function deleteNews(newsId, callback) {
    logger.args('deleteNews: ', arguments);

    return _newsRef
      .child(newsId)
      .remove(
      function onCompleteCounter(errorCounter) {

        if (errorCounter) {
          logger.warn('firebase.deleteNews: ', errorCounter);
          return callback(new NewsNotFoundError('News not found'));
        }

        changeNewsCounter(newsId, -1);

        return callback(null);
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
    deleteFestivalCategory: deleteFestivalCategory,
    getNewsCollection: getNewsCollection,
    createNews: createNews,
    getNews: getNews,
    updateNews: updateNews,
    deleteNews: deleteNews
  };
};