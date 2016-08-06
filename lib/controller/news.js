'use strict';

var logger = require('../logger/logger').logger;
var assert = require('assert-plus');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var keen = require('../keen');
var merger = require('../merger');
var cache = require('../cache');
var festivals = require('../festivals');
var extend = require('util')._extend;

var newsBuilders = require('../domain/builder/newsBuilders');

var festivalsModel = require('festivals-model');
var NewsCollectionResponseBuilder = festivalsModel.model.newsCollectionResponse.NewsCollectionResponseBuilder;
var SearchNewsRequestBuilder = festivalsModel.model.searchNewsRequest.SearchNewsRequestBuilder;
var NewsNotFoundError = festivalsModel.error.NewsNotFoundError;

var buildNews = function buildNews(data) {
  return newsBuilders.buildNewsResponse(data);
};

var getNewsCollectionV1 = function getNewsCollectionV1(req, res, next) {

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

  var festivalId = req.params.id || newsBuilders.MAIN_NEWS_NAME;
  var name = req.params.name;
  var updatedAt = req.params.updatedAt;
  var limit = req.params.limit || '100';
  var offset = req.params.offset;
  var country = req.params.country;
  var sort = req.params.sort;

  var searchRequest = new SearchNewsRequestBuilder()
    .withName(name)
    .withCountry(country)
    .withFestival(festivalId)
    .withUpdatedAt(updatedAt)
    .withLimit(limit)
    .withOffset(offset)
    .withSort(sort)
    .build();

  return festivals.getNewsCollection(searchRequest, {}, function (err, data) {
    if (err) {
      keen.errorNews('search', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    var news = data.news.map(function (item) {
      return buildNews(item);
    });

    var response = new NewsCollectionResponseBuilder()
      .withTotal(data.total)
      .withNews(news)
      .build();

    res.send(200, response);
    next();

    return keen.newsSearch(req.authorization.bearer, req.params);
  });
};

var createNewsV1 = function createNewsV1(req, res, next) {
  var news = null;

  try {
    assert.object(req.params, 'params');
    assert.optionalString(req.params.id, 'id');
    news = newsBuilders.buildNewsDomain(req.params.id, req.params, true);
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  return festivals.createNews(news, {}, function (err/*, result*/) {
    if (err) {
      keen.errorNews('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, buildNews(news));
    next();
    return cache.purge(req.authorization.credentials, '/api/news');
  });
};

var getNewsV1 = function getNewsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params['news.id'], 'news.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  var newsId = req.params['news.id'];

  return festivals.getNews(newsId, {}, function (err, news) {
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

var updateNewsV1 = function updateNewsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params['news.id'], 'news.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  var newsId = req.params['news.id'];

  return festivals.getNews(newsId, {}, function (err, news) {
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


    var newNews = newsBuilders.buildNewsDomain(req.params.id, news, false);

    return festivals.updateNews(newsId, newNews, {}, function (errNews/*, result*/) {
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

var deleteNewsV1 = function deleteNewsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params['news.id'], 'news.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  var newsId = req.params['news.id'];

  return festivals.getNews(newsId, {}, function (err, news) {
    if (err) {
      keen.errorNews('delete', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!news) {
      return next(new NewsNotFoundError('News not found'));
    }

    return festivals.deleteNews(newsId, {}, function (errNews/*, result*/) {
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
