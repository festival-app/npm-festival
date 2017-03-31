'use strict';

const moment = require('moment');
require('mongodb-moment')(moment);
const u = require('mongo-uuid');
const async = require('async');
const logger = require('../logger/logger').logger;
const extend = require('util')._extend;

const festivalsModel = require('festivals-model');
const FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;
const FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;
const FestivalPlaceNotFoundError = festivalsModel.error.FestivalPlaceNotFoundError;
const NewsNotFoundError = festivalsModel.error.NewsNotFoundError;
const FestivalCategoryNotFoundError = festivalsModel.error.FestivalCategoryNotFoundError;
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

      if (null === result) {
        return callback(new FestivalNotFoundError('Festival not found'));
      }

      return callback(null, result);
    });
  };

  const getFestival = function getFestival(festivalId, callback) {
    logger.args('getFestival: ', arguments);

    return mongodbProvider.get(festivalId, 'Festivals', (error, result) => {

      if (error) {
        logger.warn('Unable to get festival', error);
        return callback(new ServiceUnavailableError('Unable to get festival'));
      }

      if (null === result) {
        return callback(new FestivalNotFoundError('Festival not found'));
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

      if (null === result) {
        return callback(new FestivalNotFoundError('Festival not found'));
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

      if (null === festivals) {
        return callback(error, results);
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
        // id: id,
        endTime: moment(newEvent.duration.finishAt),
        ogImage: "tfss-4716ed2c-c051-4003-97d4-19e7c7e7d4ec-improving-the-facebook-login-experience-in-your-apps.png",
        startTime: moment(newEvent.duration.startAt),
        tags: [newEvent.category],  //TODO jest id, powinno byc name!
        allDay: false,
        speakers: [],
        day: 1, //TODO
        hasDetails: true,
        onMySchedule: false,
        sessionDescription: newEvent.description,
        sessionLocation: "Herbst",  //TODO newEvent.place name a nie id
        sessionSlug: "slug",
        sessionTitle: newEvent.name,
        _updated_at: moment(newEvent.updatedAt),
        _created_at: moment(newEvent.createdAt)
      };

    if (newEvent.authors.length) {
      doc.speakers = newEvent.authors.map((author) => {

        //TODO create author
        return {
          __type: "Pointer",
          className: "Speakers",
          objectId: "pgvgLxyAX5"
        }
      });
    }

    return mongodbProvider.create(extend(newEvent, doc), 'Agenda', (error, result) => {

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

      if (null === result) {
        return callback(new FestivalEventNotFoundError('Festival event not found'));
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

      if (null === events) {
        return callback(error, results);
      }

      results.total = events.length;
      results.events = events.slice(searchRequest.offset, searchRequest.limit + 1);
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

      if (null === result) {
        return callback(new FestivalEventNotFoundError('Festival event not found'));
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

      if (null === result) {
        return callback(new FestivalEventNotFoundError('Festival event not found'));
      }

      return callback(null, result);
    });
  };

  const createFestivalPlace = function createFestivalPlace(festivalId, newPlace, callback) {
    logger.args('createFestivalPlace: ', arguments);
    const id = newPlace.id;

    const doc = {
      // id : id,
      x1: "tfss-58fb10eb-2a05-40ca-9b5f-442953762aca-For Launch.png",
      x2: "tfss-ceace4a6-0ed7-4667-8bb9-bf54c1678f39-For Launch@2x.png",
      x3: "tfss-adadf809-8549-4ef0-91a6-21007e2d7746-For Launch@3x.png",
      // name : newPlace.name,
      _updated_at: moment(newPlace.updatedAt),
      _created_at: moment(newPlace.createdAt)
    };

    return mongodbProvider.create(extend(newPlace, doc), 'Maps', (error, result) => {

      if (error) {
        logger.warn('Unable to add festival place', error);
        return callback(new ServiceUnavailableError('Unable to create festival place'));
      }

      return callback(null, extend({id: id}, result));
    });
  };

  const updateFestivalPlace = function updateFestivalPlace(festivalId, placeId, newPlace, callback) {
    logger.args('updateFestivalPlace: ', arguments);

    return mongodbProvider.update(placeId, newPlace, 'Maps', (error, result) => {

      if (error) {
        logger.warn('Unable to update festival place', error);
        return callback(new ServiceUnavailableError('Unable to update festival place'));
      }

      if (null === result) {
        return callback(new FestivalPlaceNotFoundError('Festival place not found'));
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

    return mongodbProvider.search(getSearchFilters(searchRequest), 'Maps', (error, places) => {

      if (error) {
        logger.warn('Unable to get festival places', error);
        return callback(new ServiceUnavailableError('Unable to get festival places'));
      }

      if (null === places) {
        return callback(error, results);
      }

      results.total = places.length;
      results.places = places.slice(searchRequest.offset, searchRequest.limit + 1);

      return callback(null, results);
    });
  };

  const getFestivalPlace = function getFestivalPlace(festivalId, placeId, callback) {
    logger.args('getFestivalPlace: ', arguments);

    return mongodbProvider.get(placeId, 'Maps', (error, result) => {

      if (error) {
        logger.warn('Unable to get festival place', festivalId, placeId, error);
        return callback(new ServiceUnavailableError('Unable to get festival place'));
      }

      if (null === result) {
        return callback(new FestivalPlaceNotFoundError('Festival place not found'));
      }

      return callback(null, result);
    });
  };

  const deleteFestivalPlace = function deleteFestivalPlace(festivalId, placeId, callback) {
    logger.args('deleteFestivalPlace: ', arguments);

    return mongodbProvider.remove(placeId, 'Maps', (error, result) => {

      if (error) {
        logger.warn('Unable to delete festival place', festivalId, placeId, error);
        return callback(new ServiceUnavailableError('Unable to delete festival place'));
      }

      if (null === result) {
        return callback(new FestivalPlaceNotFoundError('Festival place not found'));
      }

      return callback(null, result);
    });
  };

  const createFestivalCategory = function createFestivalCategory(festivalId, newCategory, callback) {
    logger.args('createFestivalCategory: ', arguments);

    const id = newCategory.id;

    return mongodbProvider.create(newCategory, 'Categories', (error, result) => {

      if (error) {
        logger.warn('Unable to add festival category', error);
        return callback(new ServiceUnavailableError('Unable to create festival category'));
      }

      return callback(null, extend({id: id}, result));
    });
  };

  const updateFestivalCategory = function updateFestivalCategory(festivalId, categoryId, newCategory, callback) {
    logger.args('updateFestivalCategory: ', arguments);

    mongodbProvider.update(categoryId, newCategory, 'Categories', (error, result) => {

      if (error) {
        logger.warn('Unable to update festival category', error);
        return callback(new ServiceUnavailableError('Unable to update festival category'));
      }

      if (null === result) {
        return callback(new FestivalCategoryNotFoundError('Festival category not found'));
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

    return mongodbProvider.search(getSearchFilters(searchRequest), 'Categories', (error, categories) => {

      if (error) {
        logger.warn('Unable to get festival categories', error);
        return callback(new ServiceUnavailableError('Unable to get festival categories'));
      }

      if (null === categories) {
        return callback(error, results);
      }

      results.total = categories.length;
      results.categories = categories.slice(searchRequest.offset, searchRequest.limit + 1);
      return callback(null, results);
    });
  };

  const getFestivalCategory = function getFestivalCategory(festivalId, categoryId, callback) {
    logger.args('getFestivalCategory: ', arguments);

    return mongodbProvider.get(categoryId, 'Categories',
      (error, result) => {

        if (error) {
          logger.warn('Unable to get festival category', error);
          return callback(new ServiceUnavailableError('Unable to get festival category'));
        }

        if (null === result) {
          return callback(new FestivalCategoryNotFoundError('Festival category not found'));
        }

        return callback(null, result);
      });
  };

  const deleteFestivalCategory = function deleteFestivalCategory(festivalId, categoryId, callback) {
    logger.args('deleteFestivalCategory: ', arguments);

    return mongodbProvider.remove(categoryId, 'Categories',
      (error, result) => {

        if (error) {
          logger.warn('Unable to delete festival category', error);
          return callback(new ServiceUnavailableError('Unable to delete festival category'));
        }

        if (null === result) {
          return callback(new FestivalCategoryNotFoundError('Festival category not found'));
        }

        return callback(null, result);
      });
  };

  const createNews = function createNews(newNews, callback) {
    logger.args('createNews: ', arguments);

    const id = newNews.id;

    const doc = {
      text: newNews.name + "\r\n\r\n" + newNews.description,  //TODO rodzielone w UI ?
      url: null,
      _updated_at: moment(newNews.updatedAt),
      _created_at: moment(newNews.createdAt)
    };

    return mongodbProvider.create(extend(newNews, doc), 'Notification', (error, result) => {

      if (error) {
        logger.warn('Unable to add news', error);
        return callback(new ServiceUnavailableError('Unable to add news'));
      }

      return callback(null, extend({id: id}, result));
    });
  };

  const updateNews = function updateNews(newsId, newNews, callback) {
    logger.args('updateNews: ', arguments);

    return mongodbProvider.update(newsId, newNews, 'Notification', (error, result) => {

      if (error) {
        logger.warn('Unable to update news', error);
        return callback(new ServiceUnavailableError('Unable to update festival news'));
      }

      if (null === result) {
        return callback(new NewsNotFoundError('News not found'));
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

    return mongodbProvider.search(getSearchFilters(searchRequest), 'Notification', (error, news) => {

      if (error) {
        logger.warn('Unable to get news', error);
        return callback(new ServiceUnavailableError('Unable to get news'));
      }

      if (null === news) {
        return callback(error, results);
      }

      results.total = news.length;
      results.news = news.slice(searchRequest.offset, searchRequest.limit + 1);
      return callback(null, results);
    });
  };

  const getNews = function getNews(newsId, callback) {
    logger.args('getNews: ', arguments);

    return mongodbProvider.get(newsId, 'Notification', (error, result) => {

      if (error) {
        logger.warn('Unable to get news', error);
        return callback(new ServiceUnavailableError('Unable to get news'));
      }

      if (null === result) {
        return callback(new NewsNotFoundError('News not found'));
      }

      return callback(null, result);
    });
  };

  const deleteNews = function deleteNews(newsId, callback) {
    logger.args('deleteNews: ', arguments);

    return mongodbProvider.remove(newsId, 'Notification', (error, result) => {

      if (error) {
        logger.warn('Unable to delete festival news', error);
        return callback(new ServiceUnavailableError('Unable to delete news'));
      }

      if (null === result) {
        return callback(new NewsNotFoundError('News not found'));
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
