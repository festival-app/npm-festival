'use strict';

const moment = require('moment');
require('mongodb-moment')(moment);
const u = require('mongo-uuid');
const async = require('async');
const logger = require('../logger/logger').logger;
const extend = require('util')._extend;

const festivalsModel = require('festivals-model');
const ServiceUnavailableError = festivalsModel.error.ServiceUnavailableError;

const provider = function provider(mongodbProvider, config) {
  const getSearchFilters = function getSearchFilters(searchParameters) {

    const searchData = {};

    //TODO col.find({a:1}).skip(1).limit(10)
    // if (searchParameters.limit > 0) {
    //   searchData.size = searchParameters.limit;
    // }
    //
    // if (searchParameters.offset > 0) {
    //   searchData.from = searchParameters.offset;
    // }

    const filters = [];

    for (const name in searchParameters) {
      if (searchParameters.hasOwnProperty(name)) {
        const value = searchParameters[name];

        if (value && name !== 'limit' && name !== 'offset' && name !== 'sort') {
          searchData[name] = value;
        }
      }
    }

    //TODO sort([['a', 1]])
    // if (searchParameters.hasOwnProperty('sort') && searchParameters.sort) {
    //   const sort = {};
    //
    //   const re = /([+-])?(.+)/;
    //   const matches = searchParameters.sort.match(re);
    //
    //   if (matches) {
    //     let order = 'asc';
    //
    //     if (matches[1] === '-') {
    //       order = 'desc';
    //     }
    //
    //     const field = matches[2].trim();
    //
    //     sort[field] = {'order': order};
    //     searchData.sort = [sort];
    //   }
    // }

    return searchData;
  };

  const getSource = function getSource(data, callback) {
    // return callback(null, data._source);
    //TODO
    return callback(null, data);
  };

  const createFestival = function createFestival(newFestival, callback) {
    logger.args('createFestival: ', arguments);

    newFestival.updatedAt = moment(newFestival.updatedAt) || null;
    newFestival.createdAt = moment(newFestival.createdAt) || null;
    newFestival.duration.startAt = moment(newFestival.duration.startAt) || null;
    newFestival.duration.finishAt = moment(newFestival.duration.finishAt) || null;
    newFestival.userId = u.parse(newFestival.userId);

    return mongodbProvider.create(newFestival, 'Festivals', (error, result) => {

      if (error) {
        logger.warn('Unable to add festival', error);
        return callback(new ServiceUnavailableError('Unable to add festival'));
      }

      return callback(null, extend({
        id: newFestival.id,
      }, result));
    });
  };

  const updateFestival = function updateFestival(festivalId, newFestival, callback) {
    logger.args('updateFestival: ', arguments);

    return mongodbProvider.update(festivalId, newFestival, 'Festivals', (error, result) => {

      if (error) {
        logger.warn('Unable to update festival', error);
        return callback(new ServiceUnavailableError('Unable to update festival'));
      }

      return callback(null, error, result);
    });
  };

  const getFestival = function getFestival(festivalId, callback) {
    logger.args('getFestival: ', arguments);

    return mongodbProvider.get(festivalId, 'Festivals', (error, result) => {

      if (error) {
        logger.warn('Unable to get festival', error);
        return callback(new ServiceUnavailableError('Unable to get festival'));
      }

      result.userId = u.stringify(result.userId);

      return callback(null, result);
    });
  };

  const deleteFestival = function deleteFestival(festivalId, callback) {
    logger.args('deleteFestival: ', arguments);

    return mongodbProvider.remove(festivalId, 'Festivals', (error, result) => {

      if (error) {
        logger.warn('Unable to delete festival', error);
        return callback(new ServiceUnavailableError('Unable to delete festival'));
      }

      return callback(null, result);
    });
  };

  const getFestivals = function getFestivals(searchRequest, callback) {
    logger.args('getFestivals: ', arguments);

    const results = {
      total: 0,
      festivals: []
    };

    return mongodbProvider.search(getSearchFilters(searchRequest), 'Festivals', (error, festivals) => {

      if (error) {
        logger.warn('Unable to get festivals', error);
        return callback(new ServiceUnavailableError('Unable to get festivals'));
      }

      results.total = festivals.length;
      results.festivals = festivals
        .slice(searchRequest.offset, searchRequest.limit + 1)
        .map((doc) => {
          doc.userId = u.stringify(doc.userId);
          return doc;
        });

      return callback(null, results);
    });
  };

  const createFestivalEvent = function createFestivalEvent(festivalId, newEvent, callback) {
    logger.args('createFestivalEvent: ', arguments);

    const id = newEvent.id;

    const doc =
      {
        "_id": id,
        "endTime": newEvent.duration.finishAt,
        "ogImage": "tfss-4716ed2c-c051-4003-97d4-19e7c7e7d4ec-improving-the-facebook-login-experience-in-your-apps.png",
        "speakers": [{
          "__type": "Pointer",
          "className": "Speakers",
          "objectId": "pgvgLxyAX5"
        }],
        "startTime": newEvent.duration.startAt,
        "tags": [newEvent.category],
        "allDay": false,
        "day": 1,
        "hasDetails": true,
        "onMySchedule": false,
        "sessionDescription": newEvent.description,
        "sessionLocation": "Herbst",
        "sessionSlug": "slug",
        "sessionTitle": newEvent.name,
        "_updated_at": newEvent.updatedAt,
        "_created_at": newEvent.createdAt
      };

    return mongodbProvider.create(doc, 'Agenda', (error, result) => {

      if (error) {
        logger.warn('Unable to create festival event', error);
        return callback(new ServiceUnavailableError('Unable to create festival event'));
      }

      return callback(null, extend({id: id}, result));
    });
  };

  const updateFestivalEvent = function updateFestivalEvent(festivalId, eventId, newEvent, callback) {
    logger.args('updateFestivalEvent: ', arguments);

    return mongodbProvider.update(eventId, newEvent, 'Agenda', (error, result) => {

      if (error) {
        logger.warn('Unable to update festival event', error);
        return callback(new ServiceUnavailableError('Unable to update festival event'));
      }

      return callback(null, result);
    });
  };

  const getFestivalEvents = function getFestivalEvents(festivalId, searchRequest, callback) {
    logger.args('getFestivalEvents: ', arguments);

    const results = {
      total: 0,
      events: []
    };

    searchRequest.festival = festivalId;

    return mongodbProvider.search(getSearchFilters(searchRequest), 'Agenda', (error, events) => {

      if (error) {
        logger.warn('Unable to get festival events', error);
        return callback(new ServiceUnavailableError('Unable to get festival events'));
      }

      results.total = hits.total;
      results.events = events;
      return callback(null, results);
    });
  };

  const getFestivalEvent = function getFestivalEvent(festivalId, eventId, callback) {
    logger.args('getFestivalEvent: ', arguments);

    return mongodbProvider.get(eventId, 'Agenda', (error, result) => {

      if (error) {
        logger.warn('Unable to get festival event', error);
        return callback(new ServiceUnavailableError('Unable to get festival event'));
      }

      return callback(null, result);
    });
  };

  const deleteFestivalEvent = function deleteFestivalEvent(festivalId, eventId, callback) {
    logger.args('deleteFestivalEvent: ', arguments);

    return mongodbProvider.remove(eventId, 'Agenda', (error, result) => {

      if (error) {
        logger.warn('Unable to delete festival event', error);
        return callback(new ServiceUnavailableError('Unable to delete festival event'));
      }

      return callback(null, result);
    });
  };

  const createFestivalPlace = function createFestivalPlace(festivalId, newPlace, callback) {
    logger.args('createFestivalPlace: ', arguments);
    const id = newPlace.id;

    return mongodbProvider.create(id, newPlace, config.elasticsearch.places,
      (error, result) => {

        if (error) {
          logger.warn('Unable to add festival place', error);
          return callback(new ServiceUnavailableError('Unable to create festival place'));
        }

        return callback(null, extend({id: id}, result));
      });
  };

  const updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, callback) {
    logger.args('updateFestivalPlace: ', arguments);

    return mongodbProvider.update(placeId, newPlace, config.elasticsearch.places,
      (error, result) => {

        if (error) {
          logger.warn('Unable to update festival place', error);
          return callback(new ServiceUnavailableError('Unable to update festival place'));
        }

        return callback(null, result);
      });
  };

  const getFestivalPlaces = function getFestivalPlaces(festivalId, searchRequest, callback) {
    logger.args('getFestivalPlaces: ', arguments);

    const results = {
      total: 0,
      places: []
    };

    searchRequest.festival = festivalId;

    return mongodbProvider.search(getSearchFilters(searchRequest), config.elasticsearch.places,
      (error, {hits}) => {

        if (error) {
          logger.warn('Unable to get festival places', error);
          return callback(new ServiceUnavailableError('Unable to get festival places'));
        }

        if (hits && hits.total > 0 && hits.hits) {
          return async.map(hits.hits, getSource, (errHits, places) => {
            if (errHits) {
              logger.warn('Unable to get results: ', errHits);
              return callback(new ServiceUnavailableError('Unable to create festival event'));
            }

            results.total = hits.total;
            results.places = places;
            return callback(null, results);
          });
        }
        else {
          return callback(null, results);
        }
      });
  };

  const getFestivalPlace = function getFestivalPlace(festivalId, placeId, callback) {
    logger.args('getFestivalPlace: ', arguments);

    return mongodbProvider.get(placeId, config.elasticsearch.places,
      (error, result) => {

        if (error) {
          logger.warn('Unable to get festival place', festivalId, placeId, error);
          return callback(new ServiceUnavailableError('Unable to get festival place'));
        }

        return callback(null, result);
      });
  };

  const deleteFestivalPlace = function deleteFestivalPlace(festivalId, placeId, callback) {
    logger.args('deleteFestivalPlace: ', arguments);

    return mongodbProvider.remove(placeId, config.elasticsearch.places,
      (error, result) => {

        if (error) {
          logger.warn('Unable to delete festival place', festivalId, placeId, error);
          return callback(new ServiceUnavailableError('Unable to delete festival place'));
        }

        return callback(null, result);
      });
  };

  const createFestivalCategory = function createFestivalCategory(festivalId, newCategory, callback) {
    logger.args('createFestivalCategory: ', arguments);

    const id = newCategory.id;

    return mongodbProvider.create(id, newCategory, config.elasticsearch.categories,
      (error, result) => {

        if (error) {
          logger.warn('Unable to add festival category', error);
          return callback(new ServiceUnavailableError('Unable to create festival category'));
        }

        return callback(null, extend({id: id}, result));
      });
  };

  const updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, callback) {
    logger.args('updateFestivalCategory: ', arguments);

    mongodbProvider.update(categoryId, newCategory, config.elasticsearch.categories,
      (error, result) => {

        if (error) {
          logger.warn('Unable to update festival category', error);
          return callback(new ServiceUnavailableError('Unable to update festival category'));
        }

        return callback(null, result);
      });
  };

  const getFestivalCategories = function getFestivalCategories(festivalId, searchRequest, callback) {
    logger.args('getFestivalCategories: ', arguments);

    const results = {
      total: 0,
      categories: []
    };

    searchRequest.festival = festivalId;

    return mongodbProvider.search(getSearchFilters(searchRequest), config.elasticsearch.categories,
      (error, {hits}) => {

        if (error) {
          logger.warn('Unable to get festival categories', error);
          return callback(new ServiceUnavailableError('Unable to get festival categories'));
        }

        if (hits && hits.total > 0 && hits.hits) {
          return async.map(hits.hits, getSource, (errHits, categories) => {
            if (errHits) {
              logger.warn('Unable to get results: ', errHits);
              return callback(new ServiceUnavailableError('Unable to create festival event'));
            }

            results.total = hits.total;
            results.categories = categories;
            return callback(null, results);
          });
        }
        else {
          return callback(null, results);
        }
      });
  };

  const getFestivalCategory = function getFestivalCategory(festivalId, categoryId, callback) {
    logger.args('getFestivalCategory: ', arguments);

    return mongodbProvider.get(categoryId, config.elasticsearch.categories,
      (error, result) => {

        if (error) {
          logger.warn('Unable to get festival category', error);
          return callback(new ServiceUnavailableError('Unable to get festival category'));
        }

        return callback(null, result);
      });
  };

  const deleteFestivalCategory = function deleteFestivalCategory(festivalId, categoryId, callback) {
    logger.args('deleteFestivalCategory: ', arguments);

    return mongodbProvider.remove(categoryId, config.elasticsearch.categories,
      (error, result) => {

        if (error) {
          logger.warn('Unable to delete festival category', error);
          return callback(new ServiceUnavailableError('Unable to delete festival category'));
        }

        return callback(null, result);
      });
  };

  const createNews = function createNews(newNews, callback) {
    logger.args('createNews: ', arguments);

    const id = newNews.id;

    return mongodbProvider.create(id, newNews, config.elasticsearch.news,
      (error, result) => {

        if (error) {
          logger.warn('Unable to add news', error);
          return callback(new ServiceUnavailableError('Unable to add news'));
        }

        return callback(null, extend({id: id}, result));
      });
  };

  const updateNews = function updateNews(newsId, newNews, callback) {
    logger.args('updateNews: ', arguments);

    return mongodbProvider.update(newsId, newNews, config.elasticsearch.news,
      (error, result) => {

        if (error) {
          logger.warn('Unable to update news', error);
          return callback(new ServiceUnavailableError('Unable to update festival news'));
        }

        return callback(null, result);
      });
  };

  const getNewsCollection = function getNewsCollection(searchRequest, callback) {
    logger.args('getNewsCollection: ', arguments);

    const results = {
      total: 0,
      news: []
    };

    return mongodbProvider.search(getSearchFilters(searchRequest), config.elasticsearch.news,
      (error, {hits}) => {

        if (error) {
          logger.warn('Unable to get news', error);
          return callback(new ServiceUnavailableError('Unable to get news'));
        }

        if (hits && hits.total > 0 && hits.hits) {
          return async.map(hits.hits, getSource, (errHits, news) => {
            if (errHits) {
              logger.warn('Unable to get results: ', errHits);
              return callback(new ServiceUnavailableError('Unable to create festival event'));
            }

            results.total = hits.total;
            results.news = news;
            return callback(null, results);
          });
        }
        else {
          return callback(null, results);
        }
      });
  };

  const getNews = function getNews(newsId, callback) {
    logger.args('getNews: ', arguments);

    return mongodbProvider.get(newsId, config.elasticsearch.news,
      (error, result) => {

        if (error) {
          logger.warn('Unable to get news', error);
          return callback(new ServiceUnavailableError('Unable to get news'));
        }

        return callback(null, result);
      });
  };

  const deleteNews = function deleteNews(newsId, callback) {
    logger.args('deleteNews: ', arguments);

    return mongodbProvider.remove(newsId, config.elasticsearch.news,
      (error, result) => {

        if (error) {
          logger.warn('Unable to delete festival news', error);
          return callback(new ServiceUnavailableError('Unable to delete news'));
        }

        return callback(null, result);
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

module.exports = {
  provider: provider
};
