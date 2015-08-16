var logger = require('../logger/logger').logger;
var assert = require('assert-plus');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var keen = require('../keen');
var merger = require('../merger');
var festivals = require('../festivals');

var newsBuilders = require('../domain/builder/newsBuilders');

var festivalsModel = require('festivals-model').model;
var NewsCollectionResponseBuilder = festivalsModel.newsCollectionResponse.NewsCollectionResponseBuilder;
var SearchNewsRequestBuilder = festivalsModel.searchNewsRequest.SearchNewsRequestBuilder;

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
    logger.warn(e);
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

  festivals.getNewsCollection(searchRequest, {}, function (err, data) {
    if (err) {
      keen.errorNews('search', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    var news = data.news.map(function (news) {
      return buildNews(news);
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
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  festivals.createNews(news, {}, function (err, data) {
    if (err) {
      keen.errorNews('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, buildNews(data));
    return next();
  });
};

var getNewsV1 = function getNewsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params['news.id'], 'news.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var newsId = req.params['news.id'];

  festivals.getNews(newsId, {}, function (err, data) {
    if (err) {
      keen.errorNews('get', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(200, buildNews(data));
    return next();
  });
};

var updateNewsV1 = function updateNewsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params['news.id'], 'news.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var newsId = req.params['news.id'];

  festivals.getNews(newsId, {}, function (err, data) {
    if (err) {
      keen.errorNews('update', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    merger.merge(data, req.params);

    var news = newsBuilders.buildNewsDomain(req.params.id, data, false);

    festivals.updateNews(newsId, news, {}, function (err, data) {
      if (err) {
        keen.errorNews('update', req.authorization.bearer, req.params, err);
      }
      next.ifError(err);

      res.send(200, buildNews(data));
      return next();
    });
  });
};

var deleteNewsV1 = function deleteNewsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params['news.id'], 'news.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var newsId = req.params['news.id'];

  festivals.deleteNews(newsId, {}, function (err/*, data*/) {
    if (err) {
      keen.errorNews('delete', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(204, '');
    return next();
  });
};


module.exports = {
  getNewsCollectionV1: getNewsCollectionV1,
  createNewsV1: createNewsV1,
  getNewsV1: getNewsV1,
  updateNewsV1: updateNewsV1,
  deleteNewsV1: deleteNewsV1
};
