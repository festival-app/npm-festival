'use strict';

const async = require('async');
const logger = require('../logger/logger').logger;
const extend = require('util')._extend;

const festivalsModel = require('festivals-model');
const ServiceUnavailableError = festivalsModel.error.ServiceUnavailableError;

const provider = function provider(es, config) {
  const getElasticSearchFilters = function getElasticSearchFilters(searchParameters) {

    const searchData = {
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

    const filters = [];

    for (const name in searchParameters) {
      if (searchParameters.hasOwnProperty(name)) {
        const value = searchParameters[name];

        if (value && name !== 'limit' && name !== 'offset' && name !== 'sort') {
          const term = {
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

    if (filters && filters.length > 0) {
      searchData.query.filtered.filter = {
        and: filters
      };
    }

    if (searchParameters.hasOwnProperty('sort') && searchParameters.sort) {
      const sort = {};

      const re = /([+-])?(.+)/;
      const matches = searchParameters.sort.match(re);

      if (matches) {
        let order = 'asc';

        if (matches[1] === '-') {
          order = 'desc';
        }

        const field = matches[2].trim();

        sort[field] = {'order': order};
        searchData.sort = [sort];
      }
    }

    return searchData;
  };

  const getSource = function getSource(data, callback) {
    return callback(null, data._source);
  };

  const createFestival = function createFestival(newFestival, callback) {
    logger.args('createFestival: ', arguments);

    const festivalId = newFestival.id;

    return es.create(festivalId, newFestival, config.elasticsearch.festivals,
      (error, result) => {

        if (error) {
          logger.warn('Unable to add festival', error);
          return callback(new ServiceUnavailableError('Unable to add festival'));
        }

        //return callback(null, newFestival);
        return callback(null, extend({id: festivalId}, result));
      });
  };

  const updateFestival = function updateFestival(festivalId, newFestival, callback) {
    logger.args('updateFestival: ', arguments);

    return es.update(festivalId, newFestival, config.elasticsearch.festivals,
      (error, result) => {

        if (error) {
          logger.warn('Unable to update festival', error);
          return callback(new ServiceUnavailableError('Unable to update festival'));
        }

        return callback(null, error, result);
      });
  };

  const getFestival = function getFestival(festivalId, callback) {
    logger.args('getFestival: ', arguments);

    return es.get(festivalId, config.elasticsearch.festivals,
      (error, result) => {

        if (error) {
          logger.warn('Unable to get festival', error);
          return callback(new ServiceUnavailableError('Unable to get festival'));
        }

        return callback(null, result);
      });
  };

  const deleteFestival = function deleteFestival(festivalId, callback) {
    logger.args('deleteFestival: ', arguments);

    return es.remove(festivalId, config.elasticsearch.festivals,
      (error, result) => {

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

    return es.search(getElasticSearchFilters(searchRequest), config.elasticsearch.festivals,
      (error, {hits}) => {

        if (error) {
          logger.warn('Unable to get festivals', error);
          return callback(new ServiceUnavailableError('Unable to get festivals'));
        }

        if (hits && hits.total > 0 && hits.hits) {
          return async.map(hits.hits, getSource, (errHits, festivals) => {
            if (errHits) {
              logger.warn('Unable to get results: ', errHits);
              return callback(new ServiceUnavailableError('Unable to create festival event'));
            }

            results.total = hits.total;
            results.festivals = festivals;
            return callback(null, results);
          });
        }
        else {
          return callback(null, results);
        }
      });
  };

  const createFestivalEvent = function createFestivalEvent(festivalId, newEvent, callback) {
    logger.args('createFestivalEvent: ', arguments);

    const id = newEvent.id;

    return es.create(id, newEvent, config.elasticsearch.events,
      (error, result) => {

        if (error) {
          logger.warn('Unable to create festival event', error);
          return callback(new ServiceUnavailableError('Unable to create festival event'));
        }

        return callback(null, extend({id: id}, result));
      });
  };

  const updateFestivalEvent = function updateFestivalEvent(festivalId, eventId, newEvent, callback) {
    logger.args('updateFestivalEvent: ', arguments);

    return es.update(eventId, newEvent, config.elasticsearch.events,
      (error, result) => {

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

    return es.search(getElasticSearchFilters(searchRequest), config.elasticsearch.events,
      (error, {hits}) => {

        if (error) {
          logger.warn('Unable to get festival events', error);
          return callback(new ServiceUnavailableError('Unable to get festival events'));
        }

        if (hits && hits.total > 0 && hits.hits) {
          return async.map(hits.hits, getSource, (errHits, events) => {
            if (errHits) {
              logger.warn('Unable to get results: ', errHits);
              return callback(new ServiceUnavailableError('Unable to create festival event'));
            }

            results.total = hits.total;
            results.events = events;
            return callback(null, results);
          });
        }
        else {
          return callback(null, results);
        }
      });
  };

  const getFestivalEvent = function getFestivalEvent(festivalId, eventId, callback) {
    logger.args('getFestivalEvent: ', arguments);

    return es.get(eventId, config.elasticsearch.events,
      (error, result) => {

        if (error) {
          logger.warn('Unable to get festival event', error);
          return callback(new ServiceUnavailableError('Unable to get festival event'));
        }

        return callback(null, result);
      });
  };

  const deleteFestivalEvent = function deleteFestivalEvent(festivalId, eventId, callback) {
    logger.args('deleteFestivalEvent: ', arguments);

    return es.remove(eventId, config.elasticsearch.events,
      (error, result) => {

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

    return es.create(id, newPlace, config.elasticsearch.places,
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

    return es.update(placeId, newPlace, config.elasticsearch.places,
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

    return es.search(getElasticSearchFilters(searchRequest), config.elasticsearch.places,
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

    return es.get(placeId, config.elasticsearch.places,
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

    return es.remove(placeId, config.elasticsearch.places,
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

    return es.create(id, newCategory, config.elasticsearch.categories,
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

    es.update(categoryId, newCategory, config.elasticsearch.categories,
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

    return es.search(getElasticSearchFilters(searchRequest), config.elasticsearch.categories,
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

    return es.get(categoryId, config.elasticsearch.categories,
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

    return es.remove(categoryId, config.elasticsearch.categories,
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

    return es.create(id, newNews, config.elasticsearch.news,
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

    return es.update(newsId, newNews, config.elasticsearch.news,
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

    return es.search(getElasticSearchFilters(searchRequest), config.elasticsearch.news,
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

    return es.get(newsId, config.elasticsearch.news,
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

    return es.remove(newsId, config.elasticsearch.news,
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
