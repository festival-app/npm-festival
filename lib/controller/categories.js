var options = require('config');
var logger = require('../logger/logger').logger;
var assert = require('assert-plus');
var festivals = require('../festivals');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var keen = require('../keen');
var categoryBuilders = require('../domain/builder/categoryBuilders');

var festivalsModel = require('festivals-model').model;
var CategoriesCollectionResponseBuilder = festivalsModel.categoriesCollectionResponse.CategoriesCollectionResponseBuilder;
var SearchFestivalCategoriesRequestBuilder = festivalsModel.searchFestivalCategoriesRequest.SearchFestivalCategoriesRequestBuilder;

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

  festivals.createFestivalCategory(id, category, {}, function (err, data) {
    next.ifError(err);

    res.send(201, categoryBuilders.buildCategoryResponse(data));
    return next();
  });
};

var updateFestivalCategoryV1 = function updateFestivalCategoryV1(req, res, next) {
  var category = null;

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params.cid, 'cid');
    category = categoryBuilders.buildCategoryDomain(req.params.id, req.params, false);
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var cid = req.params.cid;

  festivals.updateFestivalCategory(id, cid, category, {}, function (err, data) {
    next.ifError(err);
    res.send(200, categoryBuilders.buildCategoryResponse(data));
    return next();
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

  var search = new SearchFestivalCategoriesRequestBuilder()
    .withName(name)
    .withParent(parent)
    .withUpdatedAt(updatedAt)
    .withLimit(limit)
    .withOffset(offset)
    .build();

  festivals.getFestivalCategories(id, search, options, function (err, data) {

    if (err) {
      keen.errorCategory(req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    var categories =  data.categories.map(function (category) {
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
    assert.string(req.params.cid, 'cid');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var cid = req.params.cid;

  festivals.getFestivalCategory(id, cid, options, function (err, data) {

    next.ifError(err);

    res.send(200, categoryBuilders.buildCategoryResponse(data));
    return next();
  });
};

module.exports = {
  createFestivalCategoryV1: createFestivalCategoryV1,
  updateFestivalCategoryV1: updateFestivalCategoryV1,
  getFestivalCategoriesV1: getFestivalCategoriesV1,
  getFestivalCategoryV1: getFestivalCategoryV1
};