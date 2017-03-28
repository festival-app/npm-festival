'use strict';

const logger = require('../logger/logger').logger;
const assert = require('assert-plus');
const festivals = require('../festivals');
const extend = require('util')._extend;
const myRestifyApi = require('my-restify-api');
const BadRequestError = myRestifyApi.error.BadRequestError;
const keen = require('../keen');
const merger = require('../merger');
const cache = require('../cache');
const categoryBuilders = require('../domain/builder/categoryBuilders');

const festivalsModel = require('festivals-model');
const CategoriesCollectionResponseBuilder = festivalsModel.model.categoriesCollectionResponse.CategoriesCollectionResponseBuilder;
const SearchFestivalCategoriesRequestBuilder = festivalsModel.model.searchFestivalCategoriesRequest.SearchFestivalCategoriesRequestBuilder;
const FestivalCategoryNotFoundError = festivalsModel.error.FestivalCategoryNotFoundError;


const createFestivalCategoryV1 = function createFestivalCategoryV1(req, res, next) {
  let category = null;

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    category = categoryBuilders.buildCategoryDomain(req.params.id, req.params, true);
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;

  return festivals.createFestivalCategory(id, category, {}, err/*, result*/ => {
    if (err) {
      keen.errorCategory('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, categoryBuilders.buildCategoryResponse(category));
    next();

    return cache.purge(req.authorization.credentials, `/api/festivals/${id}`);
  });
};

const updateFestivalCategoryV1 = function updateFestivalCategoryV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['category.id'], 'category.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const cid = req.params['category.id'];

  return festivals.getFestivalCategory(id, cid, {}, (err, category) => {

    if (err) {
      keen.errorCategory('update', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    if (!category) {
      return next(new FestivalCategoryNotFoundError('Festival category not found'));
    }

    merger.merge(category, req.params);
    category.id = cid; //id came from festival so we need to override it

    const newCategory = categoryBuilders.buildCategoryDomain(id, category, false);

    return festivals.updateFestivalCategory(id, cid, newCategory, {}, errCategory/*, result*/ => {
      if (errCategory) {
        keen.errorCategory('update', req.authorization.bearer, req.params, errCategory);
      }
      next.ifError(errCategory);
      res.send(200, categoryBuilders.buildCategoryResponse(extend(category, newCategory)));
      next();

      return cache.purge(req.authorization.credentials, `/api/festivals/${id}`);
    });
  });
};

const getFestivalCategoriesV1 = function getFestivalCategoriesV1(req, res, next) {
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
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const name = req.params.name;
  const parent = req.params.parent;
  const updatedAt = req.params.updatedAt || null;
  const limit = ~~req.params.limit || 100;
  const offset = ~~req.params.offset;
  const sort = req.params.sort;

  const search = new SearchFestivalCategoriesRequestBuilder()
    .withName(name)
    .withParent(parent)
    .withUpdatedAt(updatedAt)
    .withLimit(limit)
    .withOffset(offset)
    .withSort(sort)
    .build();

  return festivals.getFestivalCategories(id, search, {}, (err, data) => {
    if (err) {
      keen.errorCategory('search', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    const categories = data.categories.map(category => categoryBuilders.buildCategoryResponse(category));

    const response = new CategoriesCollectionResponseBuilder()
      .withTotal(data.total)
      .withCategories(categories)
      .build();

    res.send(200, response);
    next();

    return keen.categoriesSearch(req.authorization.bearer, req.params);
  });
};

const getFestivalCategoryV1 = function getFestivalCategoryV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['category.id'], 'category.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const cid = req.params['category.id'];

  return festivals.getFestivalCategory(id, cid, {}, (err, category) => {
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

const deleteFestivalCategoryV1 = function deleteFestivalCategoryV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['category.id'], 'category.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const cid = req.params['category.id'];

  return festivals.getFestivalCategory(id, cid, {}, (err, category) => {
    if (err) {
      keen.errorCategory('get', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!category) {
      return next(new FestivalCategoryNotFoundError('Festival category not found'));
    }

    return festivals.deleteFestivalCategory(id, cid, {}, errCategory/*, result*/ => {
      if (errCategory) {
        keen.errorCategory('delete', req.authorization.bearer, req.params, errCategory);
      }
      next.ifError(errCategory);

      res.send(204, '');
      next();

      return cache.purge(req.authorization.credentials, `/api/festivals/${id}`);
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