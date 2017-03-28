'use strict';

const options = require('config');
const logger = require('../logger/logger').logger;
const assert = require('assert-plus');
const extend = require('util')._extend;
const myRestifyApi = require('my-restify-api');
const BadRequestError = myRestifyApi.error.BadRequestError;
const ForbiddenError = myRestifyApi.error.ForbiddenError;

const festivalBuilders = require('../domain/builder/festivalBuilders');
const festivals = require('../festivals');
const keen = require('../keen');
const merger = require('../merger');
const cache = require('../cache');

const festivalsModel = require('festivals-model');

const FestivalsCollectionResponseBuilder = festivalsModel.model.festivalsCollectionResponse.FestivalsCollectionResponseBuilder;
const SearchFestivalsRequestBuilder = festivalsModel.model.searchFestivalsRequest.SearchFestivalsRequestBuilder;
const FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;

const createFestivalV1 = function createFestivalV1(req, res, next) {
  let festival = null;

  try {
    assert.object(req.params, 'params');
    festival = festivalBuilders.buildFestivalDomain(req.params, true, req.authorization.bearer.userId);
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  return festivals.createFestival(festival, {}, err/*, result*/ => {
    if (err) {
      keen.errorFestival('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, festivalBuilders.buildFestivalResponse(festival));
    next();
    return cache.purge(req.authorization.credentials, '/api/festivals');
  });
};


const updateFestivalV1 = function updateFestivalV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;

  return festivals.getFestival(id, options, (err, festival) => {
    if (err) {
      keen.errorFestival('update', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    if (!festival) {
      return next(new FestivalNotFoundError('Festival not found'));
    }

    if (req.authorization.bearer.userId !== festival.userId) {
      return next(new ForbiddenError('Unable to update selected festival', 'Brak uprawnień do edycji wybranego festiwalu'));
    }

    merger.merge(festival, req.params);

    if (req.params) {
      if (req.params.tags !== undefined) {
        //override tags from input if exists
        festival.tags = req.params.tags;
      }
    }

    const newFestival = festivalBuilders.buildFestivalDomain(festival, false, req.authorization.bearer.userId);

    return festivals.updateFestival(id, newFestival, {}, errFestival/*, result*/ => {
      if (errFestival) {
        keen.errorFestival('update', req.authorization.bearer, req.params, errFestival);
      }
      next.ifError(errFestival);
      res.send(200, festivalBuilders.buildFestivalResponse(extend(festival, newFestival)));
      next();
      return cache.purge(req.authorization.credentials, '/api/festivals');
    });
  });
};

const getFestivalsV1 = function getFestivalsV1(req, res, next) {

  try {
    assert.optionalString(req.params.name, 'name');
    assert.optionalString(req.params.description, 'description');
    assert.optionalString(req.params.type, 'type');
    assert.optionalString(req.params.status, 'status');
    assert.optionalString(req.params.dateFrom, 'dateFrom');
    assert.optionalString(req.params.dateTo, 'dateTo');
    assert.optionalString(req.params['location.country'], 'location.country');
    assert.optionalString(req.params['location.name'], 'location.name');
    assert.optionalString(req.params['location.city'], 'location.city');
    assert.optionalString(req.params['location.state'], 'location.state');
    assert.optionalString(req.params.updatedAt, 'updatedAt');
    assert.optionalString(req.params.limit, 'limit');
    assert.optionalString(req.params.offset, 'offset');
    assert.optionalString(req.params.sort, 'sort');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const name = req.params.name;
  const description = req.params.description;
  let type = req.params.type;
  const status = req.params.status;
  const dateFrom = req.params.dateFrom;
  const dateTo = req.params.dateTo;
  const locationCountry = req.params['location.country'];
  const locationName = req.params['location.name'];
  const locationCity = req.params['location.city'];
  const locationState = req.params['location.state'];
  const updatedAt = req.params.updatedAt;
  const limit = ~~req.params.limit || 100;
  const offset = ~~req.params.offset || 0;
  const sort = req.params.sort;

  if (type) {
    type = type.toLowerCase();
  }

  const searchFestivalsRequest = new SearchFestivalsRequestBuilder()
    .withName(name)
    .withDescription(description)
    .withType(type)
    //.withStatus(status)
    .withDateFrom(dateFrom)
    .withDateTo(dateTo)
    .withLocationCountry(locationCountry)
    .withLocationName(locationName)
    .withLocationCity(locationCity)
    .withLocationState(locationState)
    .withUpdatedAt(updatedAt)
    .withLimit(limit)
    .withOffset(offset)
    .withSort(sort)
    .build();

  return festivals.getFestivals(searchFestivalsRequest, options, (err, data) => {

    if (err) {
      keen.errorFestival('search', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    const collection = data.festivals
      .filter(festival => !status || status === festival.status)
      .map(festival => festivalBuilders.buildFestivalResponse(festival));

    const response = new FestivalsCollectionResponseBuilder()
      .withTotal(data.total)
      .withFestivals(collection)
      .build();

    res.send(200, response);
    next();

    return keen.festivalsSearch(req.authorization.bearer, req.params);
  });
};

const getFestivalV1 = function getFestivalV1(req, res, next) {

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;

  return festivals.getFestival(id, options, (err, festival) => {
    if (err) {
      keen.errorFestival('get', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    if (!festival) {
      return next(new FestivalNotFoundError('Festival not found'));
    }

    res.send(200, festivalBuilders.buildFestivalResponse(festival));
    return next();
  });
};

const deleteFestivalV1 = function deleteFestivalV1(req, res, next) {

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;

  return festivals.getFestival(id, options, (err, festival) => {
    next.ifError(err);

    if (!festival) {
      return next(new FestivalNotFoundError('Festival not found'));
    }

    if (req.authorization.bearer.userId !== festival.userId) {
      return next(new ForbiddenError('Unable to delete selected festival', 'Brak uprawnień do usunięcia wybranego festiwalu'));
    }

    return festivals.deleteFestival(id, options, errFestival/*, result*/ => {
      if (errFestival) {
        keen.errorFestival('delete', req.authorization.bearer, req.params, errFestival);
      }

      next.ifError(errFestival);

      res.send(204, '');
      next();
      return cache.purge(req.authorization.credentials, '/api/festivals');
    });
  });
};

module.exports = {
  createFestivalV1: createFestivalV1,
  updateFestivalV1: updateFestivalV1,
  getFestivalsV1: getFestivalsV1,
  getFestivalV1: getFestivalV1,
  deleteFestivalV1: deleteFestivalV1
};