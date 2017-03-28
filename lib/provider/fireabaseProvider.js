'use strict';

const extend = require('util')._extend;
const logger = require('../logger/logger').logger;

const festivalsModel = require('festivals-model');
const FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;
const FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;
const FestivalPlaceNotFoundError = festivalsModel.error.FestivalPlaceNotFoundError;
const NewsNotFoundError = festivalsModel.error.NewsNotFoundError;
const FestivalCategoryNotFoundError = festivalsModel.error.FestivalCategoryNotFoundError;
const ServiceUnavailableError = festivalsModel.error.ServiceUnavailableError;

module.exports.provider = function provider(db) {
  const _festivalsRef = db.ref('festivals');
  const _festivalsEventsRef = db.ref('festivals-events');
  const _festivalsPlacesRef = db.ref('festivals-places');
  const _festivalsCategoriesRef = db.ref('festivals-categories');
  const _newsRef = db.ref('news');

  const changeFestivalCategoryCounter = function changeFestivalCategoryCounter(festivalId, change) {
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

        const val = snapshot.val();
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

  const changeFestivalPlaceCounter = function changeFestivalPlaceCounter(festivalId, change) {
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

        const val = snapshot.val();
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

  const changeFestivalCounter = function changeFestivalCounter(change) {
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

        const val = snapshot.val();
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

  const changeNewsCounter = function changeNewsCounter(festivalId, change) {
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

        const val = snapshot.val();
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

  const changeFestivalEventsCounter = function changeFestivalEventsCounter(festivalId, change) {
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

        const val = snapshot.val();
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

  const createFestival = function createFestival(newFestival, callback) {
    logger.args('createFestival: ', arguments);

    const festivalId = newFestival.id;

    return _festivalsRef
      .child('festivals')
      .child(festivalId)
      .set(newFestival, error => {

        if (error) {
          logger.warn('Unable to add festival', error);
          return callback(new ServiceUnavailableError('Unable to add festival'));
        }

        changeFestivalCounter(+1);

        return callback(null, newFestival);
      });
  };

  const updateFestival = function updateFestival(festivalId, newFestival, callback) {
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

  const getFestival = function getFestival(festivalId, callback) {
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

  const deleteFestival = function deleteFestival(festivalId, callback) {
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

  const getFestivals = function getFestivals(searchFestivalsRequest, callback) {
    logger.args('getFestivals: ', arguments);

    const results = {
      total: 0,
      festivals: []
    };

    return _festivalsRef
      .child('counter')
      .once('value',
      function onSuccess(totalSnapshot) {
        results.total = totalSnapshot.val() || 0;

        let queryRef = _festivalsRef
          .child('festivals');

        if (searchFestivalsRequest.limit > 0) {
          queryRef = queryRef.limitToFirst(searchFestivalsRequest.limit);
        }

        return queryRef
          .once('value',
          snapshot => {
            const festivals = [];

            snapshot.forEach(childSnapshot => {
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

  const createFestivalEvent = function (festivalId, newEvent, callback) {
    logger.args('createFestivalEvent: ', arguments);

    const id = newEvent.id;

    return getFestival(festivalId, (err, festival) => {
      logger.debug('firebase.createFestivalEvent: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      return _festivalsEventsRef
        .child(festivalId)
        .child('events')
        .child(id)
        .set(newEvent, error => {

          if (error) {
            logger.warn('Unable to add festival', error);
            return callback(new ServiceUnavailableError('Unable to add festival'));
          }

          changeFestivalEventsCounter(festivalId, +1);

          return callback(null, newEvent);
        });
    });
  };

  const updateFestivalEvent = function updateFestivalEvent(festivalId, eventId, newEvent, callback) {
    logger.args('updateFestivalEvent: ', arguments);

    return getFestival(festivalId, (err, festival) => {
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

  const getFestivalEvents = function(festivalId, {limit}, callback) {
    logger.args('getFestivalEvents: ', arguments);

    const results = {
      total: 0,
      events: []
    };

    return _festivalsEventsRef
      .child(festivalId)
      .child('counter')
      .once('value',
      function onSuccess(totalSnapshot) {

        if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
          return callback(null, results);
        }

        results.total = totalSnapshot.val() || 0;

        let queryRef = _festivalsEventsRef
          .child(festivalId)
          .child('events');

        if (limit > 0) {
          queryRef = queryRef.limitToFirst(limit);
        }

        return queryRef
          .once('value',
          snapshot => {
            const events = [];

            snapshot.forEach(childSnapshot => {
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

  const getFestivalEvent = function (festivalId, eventId, callback) {
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

  const deleteFestivalEvent = function deleteFestivalEvent(festivalId, eventId, callback) {
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

  const createFestivalPlace = function createFestivalPlace(festivalId, newPlace, callback) {
    logger.args('createFestivalPlace: ', arguments);

    const id = newPlace.id;

    return getFestival(festivalId, (err, festival) => {
      logger.debug('firebase.createFestivalPlace: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      return _festivalsPlacesRef
        .child(festivalId)
        .child('places')
        .child(id)
        .set(newPlace, error => {

          if (error) {
            logger.warn('Unable to add festival place', error);
            return callback(new ServiceUnavailableError('Unable to add festival place'));
          }

          changeFestivalPlaceCounter(festivalId, +1);

          return callback(null, newPlace);
        });
    });
  };

  const updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, callback) {
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

  const getFestivalPlaces = function(festivalId, {limit}, callback) {
    logger.args('getFestivalPlaces: ', arguments);

    const results = {
      total: 0,
      places: []
    };

    return _festivalsPlacesRef
      .child(festivalId)
      .child('counter')
      .once('value',
      function onSuccess(totalSnapshot) {

        if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
          return callback(null, results);
        }

        results.total = totalSnapshot.val() || 0;

        let queryRef = _festivalsPlacesRef
          .child(festivalId)
          .child('places');

        if (limit > 0) {
          queryRef = queryRef.limitToFirst(limit);
        }

        return queryRef
          .once('value',
          snapshot => {
            const places = [];

            snapshot.forEach(childSnapshot => {
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

  const getFestivalPlace = function (festivalId, placeId, callback) {
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

  const deleteFestivalPlace = function deleteFestivalPlace(festivalId, placeId, callback) {
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

  const createFestivalCategory = function createFestivalCategory(festivalId, newCategory, callback) {
    logger.args('createFestivalCategory: ', arguments);

    const id = newCategory.id;

    return getFestival(festivalId, (err, festival) => {
      logger.debug('firebase.createFestivalCategory: getFestival', festival);

      if (err || !festival) {
        logger.debug(err);
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      return _festivalsCategoriesRef
        .child(festivalId)
        .child('categories')
        .child(id)
        .set(newCategory, error => {

          if (error) {
            logger.warn('Unable to add festival category', error);
            return callback(new ServiceUnavailableError('Unable to add festival category'));
          }

          changeFestivalCategoryCounter(festivalId, +1);

          return callback(null, newCategory);
        });
    });
  };

  const updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, callback) {
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

  const getFestivalCategories = function(festivalId, {limit}, callback) {
    logger.args('getFestivalCategories: ', arguments);

    const results = {
      total: 0,
      categories: []
    };

    return _festivalsCategoriesRef
      .child(festivalId)
      .child('counter')
      .once('value',
      function onSuccess(totalSnapshot) {

        if (totalSnapshot.val() === null || !totalSnapshot.exists()) {
          return callback(null, results);
        }

        results.total = totalSnapshot.val() || 0;

        let queryRef = _festivalsCategoriesRef
          .child(festivalId)
          .child('categories');

        if (limit > 0) {
          queryRef = queryRef.limitToFirst(limit);
        }

        return queryRef
          .once('value',
          snapshot => {
            const categories = [];

            snapshot.forEach(childSnapshot => {
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

  const getFestivalCategory = function (festivalId, categoryId, callback) {
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

  const deleteFestivalCategory = function deleteFestivalCategory(festivalId, categoryId, callback) {
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

  const getNewsCollection = function getNewsCollection(searchRequest, callback) {
    logger.args('getNewsCollection: ', arguments);

    const festivalId = searchRequest.festival;

    const results = {
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

        results.total = totalSnapshot.val() || 0;

        let queryRef = _newsRef;

        if (~~searchRequest.limit > 0) {
          queryRef = _newsRef.limitToFirst(~~searchRequest.limit);
        }

        return queryRef
          .once('value',
          snapshot => {
            const news = [];

            snapshot.forEach(childSnapshot => {
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

  const createNews = function createNews(news, callback) {
    logger.args('createNews: ', arguments);

    const id = news.id;

    return _newsRef
      .child(id)
      .set(news, error => {

        if (error) {
          logger.warn('Unable to add news', error);
          return callback(new ServiceUnavailableError('Unable to add news'));
        }

        changeNewsCounter(id, +1);

        return callback(null, news);
      });
  };


  const getNews = function getNews(newsId, callback) {
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

  const updateNews = function updateNews(newsId, newNews, callback) {
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

  const deleteNews = function deleteNews(newsId, callback) {
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