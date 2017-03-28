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
const placeBuilders = require('../domain/builder/placeBuilders');

const festivalsModel = require('festivals-model');
const PlacesCollectionResponseBuilder = festivalsModel.model.placesCollectionResponse.PlacesCollectionResponseBuilder;
const SearchFestivalPlacesRequestBuilder = festivalsModel.model.searchFestivalPlacesRequest.SearchFestivalPlacesRequestBuilder;
const FestivalPlaceNotFoundError = festivalsModel.error.FestivalPlaceNotFoundError;

const createFestivalPlaceV1 = function createFestivalPlaceV1(req, res, next) {
  let place = null;

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    place = placeBuilders.buildPlaceDomain(req.params.id, req.params, true);
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;

  return festivals.createFestivalPlace(id, place, {}, err/*, result*/ => {
    if (err) {
      keen.errorPlace('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, placeBuilders.buildPlaceResponse(place));
    next();
    return cache.purge(req.authorization.credentials, `/api/festivals/${id}`);
  });
};

const updateFestivalPlaceV1 = function updateFestivalPlaceV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['place.id'], 'place.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const pid = req.params['place.id'];

  return festivals.getFestivalPlace(id, pid, {}, (err, place) => {
    if (err) {
      keen.errorPlace('update', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    if (!place) {
      return next(new FestivalPlaceNotFoundError('Festival place not found'));
    }

    merger.merge(place, req.params);

    place.id = pid; //id came from festival so we need to override it

    const newPlace = placeBuilders.buildPlaceDomain(req.params.id, req.params, false);

    return festivals.updateFestivalPlace(id, pid, newPlace, {}, errPlace/*, result*/ => {
      if (errPlace) {
        keen.errorPlace('update', req.authorization.bearer, req.params, errPlace);
      }
      next.ifError(errPlace);
      res.send(200, placeBuilders.buildPlaceResponse(extend(place, newPlace)));
      next();
      return cache.purge(req.authorization.credentials, `/api/festivals/${id}`);
    });
  });
};

const getFestivalPlacesV1 = function getFestivalPlacesV1(req, res, next) {
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

  const search = new SearchFestivalPlacesRequestBuilder()
    .withName(name)
    .withParent(parent)
    .withUpdatedAt(updatedAt)
    .withLimit(limit)
    .withOffset(offset)
    .withSort(sort)
    .build();

  return festivals.getFestivalPlaces(id, search, {}, (err, data) => {

    if (err) {
      keen.errorPlace('search', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    const places = data.places.map(place => placeBuilders.buildPlaceResponse(place));

    const response = new PlacesCollectionResponseBuilder()
      .withTotal(data.total)
      .withPlaces(places)
      .build();

    res.send(200, response);
    next();

    return keen.placesSearch(req.authorization.bearer, req.params);
  });
};

const getFestivalPlaceV1 = function getFestivalPlaceV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['place.id'], 'place.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const pid = req.params['place.id'];

  return festivals.getFestivalPlace(id, pid, {}, (err, place) => {
    if (err) {
      keen.errorPlace('get', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!place) {
      return next(new FestivalPlaceNotFoundError('Festival place not found'));
    }

    res.send(200, placeBuilders.buildPlaceResponse(place));
    return next();
  });
};

const deleteFestivalPlaceV1 = function deleteFestivalPlaceV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['place.id'], 'place.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const pid = req.params['place.id'];

  return festivals.getFestivalPlace(id, pid, {}, (err, place) => {
    if (err) {
      keen.errorPlace('delete', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!place) {
      return next(new FestivalPlaceNotFoundError('Festival place not found'));
    }

    return festivals.deleteFestivalPlace(id, pid, {}, errPlace/*, result*/ => {
      if (errPlace) {
        keen.errorPlace('delete', req.authorization.bearer, req.params, errPlace);
      }
      next.ifError(errPlace);

      res.send(204, '');
      next();
      return cache.purge(req.authorization.credentials, `/api/festivals/${id}`);
    });
  });
};

module.exports = {
  createFestivalPlaceV1: createFestivalPlaceV1,
  updateFestivalPlaceV1: updateFestivalPlaceV1,
  getFestivalPlacesV1: getFestivalPlacesV1,
  getFestivalPlaceV1: getFestivalPlaceV1,
  deleteFestivalPlaceV1: deleteFestivalPlaceV1
};