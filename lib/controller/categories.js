'use strict';

var logger = require('../logger/logger').logger;
var assert = require('assert-plus');
var festivals = require('../festivals');
var extend = require('util')._extend;
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var keen = require('../keen');
var merger = require('../merger');
var cache = require('../cache');
var categoryBuilders = require('../domain/builder/categoryBuilders');

var festivalsModel = require('festivals-model');
var CategoriesCollectionResponseBuilder = festivalsModel.model.categoriesCollectionResponse.CategoriesCollectionResponseBuilder;
var SearchFestivalCategoriesRequestBuilder = festivalsModel.model.searchFestivalCategoriesRequest.SearchFestivalCategoriesRequestBuilder;
var FestivalCategoryNotFoundError = festivalsModel.error.FestivalCategoryNotFoundError;


var createFestivalCategoryV1 = function createFestivalCategoryV1(req, res, next) {
  var category = null;

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    category = categoryBuilders.buildCategoryDomain(req.params.id, req.params, true);
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.createFestivalCategory(id, category, {}, function (err/*, result*/) {
    if (err) {
      keen.errorCategory('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, categoryBuilders.buildCategoryResponse(category));
    next();

    return cache.purge(req.authorization.credentials, '/api/festivals/' + id);
  });
};

var updateFestivalCategoryV1 = function updateFestivalCategoryV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['category.id'], 'category.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var cid = req.params['category.id'];

  festivals.getFestivalCategory(id, cid, {}, function (err, category) {

    if (err) {
      keen.errorCategory('update', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    if (!category) {
      return next(new FestivalCategoryNotFoundError('Festival category not found'));
    }

    merger.merge(category, req.params);
    category.id = cid; //id came from festival so we need to override it

    var newCategory = categoryBuilders.buildCategoryDomain(id, category, false);

    festivals.updateFestivalCategory(id, cid, newCategory, {}, function (errCategory/*, result*/) {
      if (errCategory) {
        keen.errorCategory('update', req.authorization.bearer, req.params, errCategory);
      }
      next.ifError(errCategory);
      res.send(200, categoryBuilders.buildCategoryResponse(extend(category, newCategory)));
      next();

      return cache.purge(req.authorization.credentials, '/api/festivals/' + id);
    });
  });
};

var getFestivalCategoriesV1 = function getFestivalCategoriesV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');

    assert.optionalString(req.params.name, 'name');
    assert.optionalString(req.params.parent, 'parent');
    assert.optionalString(req.params.updatedAt, 'updatedAt');
    assert.optionalString(req.params.limit, 'limit');
    assert.optionalString(req.params.offset, 'offset');
    assert.optionalString(req.params.sort, 'sort');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var name = req.params.name;
  var parent = req.params.parent;
  var updatedAt = req.params.updatedAt || null;
  var limit = ~~req.params.limit || 100;
  var offset = ~~req.params.offset;
  var sort = req.params.sort;

  var search = new SearchFestivalCategoriesRequestBuilder()
    .withName(name)
    .withParent(parent)
    .withUpdatedAt(updatedAt)
    .withLimit(limit)
    .withOffset(offset)
    .withSort(sort)
    .build();

  festivals.getFestivalCategories(id, search, {}, function (err, data) {
    if (err) {
      keen.errorCategory('search', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    var categories = data.categories.map(function (category) {
      return categoryBuilders.buildCategoryResponse(category);
    });

    var response = new CategoriesCollectionResponseBuilder()
      .withTotal(data.total)
      .withCategories(categories)
      .build();

    res.send(200, response);
    next();

    return keen.categoriesSearch(req.authorization.bearer, req.params);
  });
};

var getFestivalCategoryV1 = function getFestivalCategoryV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['category.id'], 'category.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var cid = req.params['category.id'];

  festivals.getFestivalCategory(id, cid, {}, function (err, category) {
    if (err) {
      keen.errorCategory('get', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!category) {
      return next(new FestivalCategoryNotFoundError('Festival category not found'));
    }

    res.send(200, categoryBuilders.buildCategoryResponse(category));
    return next();
  });
};

var deleteFestivalCategoryV1 = function deleteFestivalCategoryV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['category.id'], 'category.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var cid = req.params['category.id'];

  festivals.getFestivalCategory(id, cid, {}, function (err, category) {
    if (err) {
      keen.errorCategory('get', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!category) {
      return next(new FestivalCategoryNotFoundError('Festival category not found'));
    }

    festivals.deleteFestivalCategory(id, cid, {}, function (errCategory/*, result*/) {
      if (errCategory) {
        keen.errorCategory('delete', req.authorization.bearer, req.params, errCategory);
      }
      next.ifError(errCategory);

      res.send(204, '');
      next();

      return cache.purge(req.authorization.credentials, '/api/festivals/' + id);
    });
  });
};

module.exports = {
  createFestivalCategoryV1: createFestivalCategoryV1,
  updateFestivalCategoryV1: updateFestivalCategoryV1,
  getFestivalCategoriesV1: getFestivalCategoriesV1,
  getFestivalCategoryV1: getFestivalCategoryV1,
  deleteFestivalCategoryV1: deleteFestivalCategoryV1
};