'use strict';

const meta = require('./meta');
const async = require('async');
const logger = require('./logger/logger').logger;
const provider = require('./provider/provider').getProvider();
const extend = require('util')._extend;

const CategoryBreadcrumbs = require('./breadcrumbs/categoryBreadcrumbs').CategoryBreadcrumbs;
const PlaceBreadcrumbs = require('./breadcrumbs/placeBreadcrumbs').PlaceBreadcrumbs;

const decorateEvent = function decorateEvent(event, callback) {
  return async.parallel({
    place: function (cb) {
      async.setImmediate(() => cb(null, placeBreadcrumbs.get(event.festival, event.place)));
    },
    category: function (cb) {
      async.setImmediate(() => cb(null, categoryBreadcrumbs.get(event.festival, event.category)));
    }
  }, (err, data) => {

    if (err) {
      return callback(err);
    }

    return callback(null, extend(event, data));
  });
};

const createFestival = function createFestival(newFestival, options, callback) {
  logger.debug('createFestival: ', newFestival);

  try {
    return provider.createFestival(newFestival, (err, festival) => {

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

const updateFestival = function updateFestival(festivalId, newFestival, options, callback) {
  logger.debug('updateFestival: ', festivalId, newFestival);

  try {
    return provider.updateFestival(festivalId, newFestival, (err, festival) => {

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

const getFestival = function getFestival(id, options, callback) {
  logger.debug('getFestival: ', id);

  try {
    return provider.getFestival(id, (err, festival) => {

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

const deleteFestivalCategories = function deleteFestivalCategories(id, callback) {
  try {
    return provider.getFestivalCategories(id, {}, (err, {total, categories}) => {

      if (err) {
        logger.debug('Unable to get categories: ', err);
        return callback(err);
      }

      if (total > 0) {
        for (let i = 0; i < total; ++i) {
          const cat = categories[i];

          if (cat) {
            return provider.deleteFestivalCategory(id, cat.id, errDeleteCat => {
              if (errDeleteCat) {
                logger.debug('Unable to delete festival category: ', errDeleteCat);
              }
            });
          }
        }
        return callback(null, null);
      }
      else {
        return callback(null, null);
      }
    });
  }
  catch (e) {
    logger.warn('unable to get categories for: ', id, e);
    return callback(e);
  }
};

const deleteFestivalPlaces = function deleteFestivalPlaces(id, callback) {
  try {
    return provider.getFestivalPlaces(id, {}, (err, collection) => {

      if (err) {
        logger.debug('Unable to get places: ', err);
        return callback(err);
      }

      if (collection.total > 0) {
        for (let i = 0; i < collection.total; ++i) {
          const place = collection.places[i];

          if (place) {
            return provider.deleteFestivalPlace(id, place.id, errDeleteFestival => {
              if (errDeleteFestival) {
                logger.debug('Unable to delete festival place: ', errDeleteFestival);
              }
            });
          }
        }
        return callback(null, null);
      }
      else {
        return callback(null, collection);
      }
    });
  }
  catch (e) {
    logger.warn('unable to get categories for: ', id, e);
    return callback(e);
  }
};

const deleteFestival = function deleteFestival(id, options, callback) {
  logger.debug('deleteFestival: ', id);

  try {

    return deleteFestivalCategories(id, errCat => {

      if (errCat) {
        logger.debug('Unable to delete festival categories: ', errCat);
        return callback(errCat);
      }

      return deleteFestivalPlaces(id, errPlace => {

        if (errPlace) {
          logger.debug('Unable to delete festival places: ', errPlace);
          return callback(errPlace);
        }

        return provider.deleteFestival(id, (err, festival) => {

          if (err) {
            logger.debug('Unable to delete festival: ', err);
            return callback(err);
          }

          return callback(null, festival);
        });
      });
    });
  }
  catch (e) {
    logger.warn('unable to delete festival for id: ', id, e);
    return callback(e);
  }
};

const getFestivals = function getFestivals(searchRequest, options, callback) {
  logger.debug('getFestivals: ', searchRequest);

  try {
    return provider.getFestivals(searchRequest, (err, festivals) => {

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

const createFestivalEvent = function createFestivalEvent(festivalId, newEvent, options, callback) {
  logger.debug('createFestivalEvent: ', festivalId, newEvent);

  try {
    return provider.createFestivalEvent(festivalId, newEvent, (err, event) => {

      if (err) {
        logger.debug('Unable to create festival event: ', festivalId, newEvent, err);
        return callback(err);
      }

      return decorateEvent(event, (errDecorate, result) => {
        if (errDecorate) {
          logger.warn('Unable to decorate event: ', event, errDecorate);
          return callback(errDecorate);
        }

        return callback(null, result);
      });
    });
  }
  catch (e) {
    logger.warn('unable to create event: ', e);
    return callback(e);
  }
};

const updateFestivalEvent = function updateFestivalEvent(festivalId, eventId, newEvent, options, callback) {
  logger.debug('updateFestivalEvent: ', festivalId, eventId, newEvent);

  try {
    return provider.updateFestivalEvent(festivalId, eventId, newEvent, (err, event) => {

      if (err) {
        logger.debug('updateFestivalEvent: Unable to update event: ', newEvent, err);
        return callback(err);
      }

      return decorateEvent(event, (errDecorate, result) => {
        if (errDecorate) {
          logger.warn('Unable to decorate event: ', event, errDecorate);
          return callback(errDecorate);
        }

        return callback(null, result);
      });
    });
  }
  catch (e) {
    logger.warn('updateFestivalEvent: unable to update event: ', e);
    return callback(e);
  }
};

const getFestivalEvent = function getFestivalEvent(festivalId, eventId, options, callback) {
  logger.debug('getFestivalEvent: ', festivalId, eventId);

  try {
    return provider.getFestivalEvent(festivalId, eventId, (err, event) => {

      if (err) {
        logger.warn('Unable to decorate event: ', event, err);
        return callback(err);
      }

      return decorateEvent(event, (errDecorate, result) => {
        if (errDecorate) {
          logger.debug('Unable to decorate event: ', event, errDecorate);
          return callback(errDecorate);
        }

        return callback(null, result);
      });
    });
  }
  catch (e) {
    logger.warn('unable to get festival event for id: ', festivalId, eventId, e);
    return callback(e);
  }
};

const deleteFestivalEvent = function deleteFestivalEvent(festivalId, eventId, options, callback) {
  logger.debug('deleteFestivalEvent: ', festivalId, eventId);

  try {
    return provider.deleteFestivalEvent(festivalId, eventId, (err, event) => {

      if (err) {
        logger.debug('Unable to delete event: ', err);
        return callback(err);
      }

      return callback(null, event);
    });
  }
  catch (e) {
    logger.warn('unable to delete event for id: ', festivalId, eventId, e);
    return callback(e);
  }
};

const getFestivalEvents = function getFestivalEvents(id, searchRequest, options, callback) {
  logger.debug('getFestivalEvents: ', id, searchRequest);

  try {
    return provider.getFestivalEvents(id, searchRequest, (err, data) => {

      if (err) {
        logger.debug('Unable to get events: ', err);
        return callback(err);
      }

      return async.map(data.events, decorateEvent, (errDecorate, events) => {

        if (errDecorate) {
          return callback(errDecorate);
        }

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

const createFestivalPlace = function createFestivalPlace(festivalId, newPlace, options, callback) {
  logger.debug('createFestivalPlace: ', festivalId, newPlace);

  try {
    return provider.createFestivalPlace(festivalId, newPlace, (err, place) => {

      if (err) {
        logger.debug('Unable to create place: ', festivalId, newPlace, err);
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

const updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, options, callback) {
  logger.debug('updateFestivalPlace: ', festivalId, placeId, newPlace);

  try {
    return provider.updateFestivalPlace(festivalId, placeId, newPlace, (err, place) => {

      if (err) {
        logger.debug('Unable to update place: ', newPlace, err);
        return callback(err);
      }

      placeBreadcrumbs.updateBreadcrumbs(festivalId, place);

      return callback(null, place);
    });
  }
  catch (e) {
    logger.warn('unable to update place: ', e);
    return callback(e);
  }
};

const getFestivalPlace = function getFestivalPlace(festivalId, placeId, options, callback) {
  logger.debug('getFestivalPlace: ', festivalId, placeId);

  try {
    return provider.getFestivalPlace(festivalId, placeId, (err, place) => {

      if (err) {
        logger.debug('Unable to get place: ', err);
        return callback(err);
      }

      return callback(null, place);
    });
  }
  catch (e) {
    logger.warn('unable to get place for id: ', festivalId, placeId, e);
    return callback(e);
  }
};

const deleteFestivalPlace = function deleteFestivalPlace(festivalId, placeId, options, callback) {
  logger.debug('deleteFestivalPlace: ', festivalId, placeId);

  try {
    return provider.deleteFestivalPlace(festivalId, placeId, (err, place) => {

      if (err) {
        logger.debug('Unable to delete place: ', err);
        return callback(err);
      }

      return callback(null, place);
    });
  }
  catch (e) {
    logger.warn('unable to delete place for id: ', festivalId, placeId, e);
    return callback(e);
  }
};

const getFestivalPlaces = function getFestivalPlaces(id, searchRequest, options, callback) {
  logger.debug('getFestivalPlaces: ', id, searchRequest);

  try {
    return provider.getFestivalPlaces(id, searchRequest, (err, places) => {

      if (err) {
        logger.debug('Unable to get places: ', err);
        return callback(err);
      }

      return callback(null, places);
    });
  }
  catch (e) {
    logger.warn('unable to get places for: ', id, searchRequest, e);
    return callback(e);
  }
};

const createFestivalCategory = function createFestivalCategory(festivalId, newCategory, options, callback) {
  logger.debug('createFestivalCategory: ', festivalId, newCategory);

  try {
    return provider.createFestivalCategory(festivalId, newCategory, (err, category) => {

      if (err) {
        logger.debug('Unable to create category: ', festivalId, newCategory, err);
        return callback(err);
      }

      categoryBreadcrumbs.updateBreadcrumbs(festivalId, category);

      return callback(null, category);
    });
  }
  catch (e) {
    logger.warn('unable to create category: ', e);
    return callback(e);
  }
};

const updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, options, callback) {
  logger.debug('updateFestivalCategory: ', festivalId, categoryId, newCategory);

  try {
    return provider.updateFestivalCategory(festivalId, categoryId, newCategory, (err, category) => {

      if (err) {
        logger.debug('Unable to update category: ', newCategory, err);
        return callback(err);
      }

      categoryBreadcrumbs.updateBreadcrumbs(festivalId, category);

      return callback(null, category);
    });
  }
  catch (e) {
    logger.warn('unable to update category: ', e);
    return callback(e);
  }
};

const getFestivalCategory = function getFestivalCategory(festivalId, categoryId, options, callback) {
  logger.debug('getFestivalCategory: ', festivalId, categoryId);

  try {
    return provider.getFestivalCategory(festivalId, categoryId, (err, category) => {

      if (err) {
        logger.debug('Unable to get category: ', err);
        return callback(err);
      }

      return callback(null, category);
    });
  }
  catch (e) {
    logger.warn('unable to get category for id: ', festivalId, categoryId, e);
    return callback(e);
  }
};

const deleteFestivalCategory = function deleteFestivalCategory(festivalId, categoryId, options, callback) {
  logger.debug('deleteFestivalCategory: ', festivalId, categoryId);

  try {
    return provider.deleteFestivalCategory(festivalId, categoryId, (err, category) => {

      if (err) {
        logger.debug('Unable to delete category: ', err);
        return callback(err);
      }

      return callback(null, category);
    });
  }
  catch (e) {
    logger.warn('unable to delete category for id: ', festivalId, categoryId, e);
    return callback(e);
  }
};

const getFestivalCategories = function getFestivalCategories(id, searchRequest, options, callback) {
  logger.debug('getFestivalCategories: ', id, searchRequest);

  try {
    return provider.getFestivalCategories(id, searchRequest, (err, categories) => {

      if (err) {
        logger.debug('Unable to get categories: ', err);
        return callback(err, categories);
      }

      return callback(err, categories);
    });
  }
  catch (e) {
    logger.warn('unable to get categories for: ', id, searchRequest, e);
    return callback(e);
  }
};

const createNews = function createNews(newNews, options, callback) {
  logger.debug('createNews: ', newNews);

  try {
    return provider.createNews(newNews, (err, news) => {

      if (err) {
        logger.debug('Unable to create news: ', newNews, err);
        return callback(err);
      }

      return callback(null, news);
    });
  }
  catch (e) {
    logger.warn('unable to create news: ', e);
    return callback(e);
  }
};

const updateNews = function updateNews(newsId, newNews, options, callback) {
  logger.debug('updateNews: ', newsId, newNews);

  try {
    return provider.updateNews(newsId, newNews, (err, news) => {

      if (err) {
        logger.debug('Unable to update news: ', newNews, err);
        return callback(err);
      }

      return callback(null, news);
    });
  }
  catch (e) {
    logger.warn('unable to update news: ', e);
    return callback(e);
  }
};

const getNews = function getNews(newsId, options, callback) {
  logger.debug('getNews: ', newsId);

  try {
    return provider.getNews(newsId, (err, news) => {

      if (err) {
        logger.debug('Unable to get news: ', err);
        return callback(err);
      }

      return callback(null, news);
    });
  }
  catch (e) {
    logger.warn('unable to get news for id: ', newsId, e);
    return callback(e);
  }
};

const deleteNews = function deleteNews(newsId, options, callback) {
  logger.debug('deleteNews: ', newsId);

  try {
    return provider.deleteNews(newsId, (err, news) => {

      if (err) {
        logger.debug('Unable to delete news: ', err);
        return callback(err);
      }

      return callback(null, news);
    });
  }
  catch (e) {
    logger.warn('unable to delete news for id: ', newsId, e);
    return callback(e);
  }
};

const getNewsCollection = function getNewsCollection(searchRequest, options, callback) {
  logger.debug('getNewsCollection: ', searchRequest);

  try {
    return provider.getNewsCollection(searchRequest, (err, newsCollection) => {

      if (err) {
        logger.debug('Unable to get news collection: ', err);
        return callback(err);
      }

      return callback(null, newsCollection);
    });
  }
  catch (e) {
    logger.warn('unable to get news collection for: ', searchRequest, e);
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
  deleteFestivalCategory: deleteFestivalCategory,
  getNewsCollection: getNewsCollection,
  createNews: createNews,
  getNews: getNews,
  updateNews: updateNews,
  deleteNews: deleteNews
};
//
// var categoryBreadcrumbs = new CategoryBreadcrumbs(module.exports);
// var placeBreadcrumbs = new PlaceBreadcrumbs(module.exports);
//
// categoryBreadcrumbs.rebuild(() => /*err, result*/{
//
// });
//
// placeBreadcrumbs.rebuild(() => /*err, result*/{
//
// });
