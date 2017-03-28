'use strict';

const logger = require('../logger/logger').logger;
const assert = require('assert-plus');
const myRestifyApi = require('my-restify-api');
const BadRequestError = myRestifyApi.error.BadRequestError;
const keen = require('../keen');
const merger = require('../merger');
const cache = require('../cache');
const festivals = require('../festivals');
const extend = require('util')._extend;

const newsBuilders = require('../domain/builder/newsBuilders');

const festivalsModel = require('festivals-model');
const NewsCollectionResponseBuilder = festivalsModel.model.newsCollectionResponse.NewsCollectionResponseBuilder;
const SearchNewsRequestBuilder = festivalsModel.model.searchNewsRequest.SearchNewsRequestBuilder;
const NewsNotFoundError = festivalsModel.error.NewsNotFoundError;

const buildNews = function buildNews(data) {
  return newsBuilders.buildNewsResponse(data);
};

const getNewsCollectionV1 = function getNewsCollectionV1(req, res, next) {

  try {
    assert.object(req.params, 'params');
    assert.optionalString(req.params.id, 'id');
    assert.optionalString(req.params.name, 'name');
    assert.optionalString(req.params.updatedAt, 'updatedAt');
    assert.optionalString(req.params.limit, 'limit');
    assert.optionalString(req.params.offset, 'offset');
    assert.optionalString(req.params.country, 'country');
    assert.optionalString(req.params.sort, 'sort');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const festivalId = req.params.id || newsBuilders.MAIN_NEWS_NAME;
  const name = req.params.name;
  const updatedAt = req.params.updatedAt;
  const limit = req.params.limit || '100';
  const offset = req.params.offset;
  const country = req.params.country;
  const sort = req.params.sort;

  const searchRequest = new SearchNewsRequestBuilder()
    .withName(name)
    .withCountry(country)
    .withFestival(festivalId)
    .withUpdatedAt(updatedAt)
    .withLimit(limit)
    .withOffset(offset)
    .withSort(sort)
    .build();

  return festivals.getNewsCollection(searchRequest, {}, (err, data) => {
    if (err) {
      keen.errorNews('search', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    const news = data.news.map(item => buildNews(item));

    const response = new NewsCollectionResponseBuilder()
      .withTotal(data.total)
      .withNews(news)
      .build();

    res.send(200, response);
    next();

    return keen.newsSearch(req.authorization.bearer, req.params);
  });
};

const createNewsV1 = function createNewsV1(req, res, next) {
  let news = null;

  try {
    assert.object(req.params, 'params');
    assert.optionalString(req.params.id, 'id');
    news = newsBuilders.buildNewsDomain(req.params.id, req.params, true);
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  return festivals.createNews(news, {}, err/*, result*/ => {
    if (err) {
      keen.errorNews('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, buildNews(news));
    next();
    return cache.purge(req.authorization.credentials, '/api/news');
  });
};

const getNewsV1 = function getNewsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params['news.id'], 'news.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const newsId = req.params['news.id'];

  return festivals.getNews(newsId, {}, (err, news) => {
    if (err) {
      keen.errorNews('get', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    if (!news) {
      return next(new NewsNotFoundError('News not found'));
    }

    res.send(200, buildNews(news));
    return next();
  });
};

const updateNewsV1 = function updateNewsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params['news.id'], 'news.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const newsId = req.params['news.id'];

  return festivals.getNews(newsId, {}, (err, news) => {
    if (err) {
      keen.errorNews('update', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!news) {
      return next(new NewsNotFoundError('News not found'));
    }

    merger.merge(news, req.params);

    if (req.params) {
      if (req.params.tags !== undefined) {
        //override tags from input if exists
        news.tags = req.params.tags;
      }
    }

    news.id = newsId; //id came from festival so we need to override it


    const newNews = newsBuilders.buildNewsDomain(req.params.id, news, false);

    return festivals.updateNews(newsId, newNews, {}, errNews/*, result*/ => {
      if (errNews) {
        keen.errorNews('update', req.authorization.bearer, req.params, errNews);
      }
      next.ifError(errNews);

      res.send(200, buildNews(extend(news, newNews)));
      next();
      return cache.purge(req.authorization.credentials, '/api/news');
    });
  });
};

const deleteNewsV1 = function deleteNewsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params['news.id'], 'news.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const newsId = req.params['news.id'];

  return festivals.getNews(newsId, {}, (err, news) => {
    if (err) {
      keen.errorNews('delete', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!news) {
      return next(new NewsNotFoundError('News not found'));
    }

    return festivals.deleteNews(newsId, {}, errNews/*, result*/ => {
      if (errNews) {
        keen.errorNews('delete', req.authorization.bearer, req.params, errNews);
      }
      next.ifError(errNews);

      res.send(204, '');
      next();
      return cache.purge(req.authorization.credentials, '/api/news');
    });
  });
};


module.exports = {
  getNewsCollectionV1: getNewsCollectionV1,
  createNewsV1: createNewsV1,
  getNewsV1: getNewsV1,
  updateNewsV1: updateNewsV1,
  deleteNewsV1: deleteNewsV1
};
