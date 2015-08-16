var logger = require('../logger/logger').logger;
var assert = require('assert-plus');
var festivals = require('../festivals');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var keen = require('../keen');
var merger = require('../merger');
var placeBuilders = require('../domain/builder/placeBuilders');

var festivalsModel = require('festivals-model').model;
var PlacesCollectionResponseBuilder = festivalsModel.placesCollectionResponse.PlacesCollectionResponseBuilder;
var SearchFestivalPlacesRequestBuilder = festivalsModel.searchFestivalPlacesRequest.SearchFestivalPlacesRequestBuilder;

var createFestivalPlaceV1 = function createFestivalPlaceV1(req, res, next) {
  var place = null;

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    place = placeBuilders.buildPlaceDomain(req.params.id, req.params, true);
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.createFestivalPlace(id, place, {}, function (err, data) {
    if (err) {
      keen.errorPlace('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, placeBuilders.buildPlaceResponse(data));
    return next();
  });
};

var updateFestivalPlaceV1 = function updateFestivalPlaceV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['place.id'], 'place.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var pid = req.params['place.id'];

  festivals.getFestivalPlace(id, pid, {}, function (err, data) {
    if (err) {
      keen.errorPlace('update', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    merger.merge(data, req.params);

    var place = placeBuilders.buildPlaceDomain(req.params.id, req.params, false);

    festivals.updateFestivalPlace(id, pid, place, {}, function (err, data) {
      if (err) {
        keen.errorPlace('update', req.authorization.bearer, req.params, err);
      }
      next.ifError(err);
      res.send(200, placeBuilders.buildPlaceResponse(data));
      return next();
    });
  });
};

var getFestivalPlacesV1 = function getFestivalPlacesV1(req, res, next) {
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

  var search = new SearchFestivalPlacesRequestBuilder()
    .withName(name)
    .withParent(parent)
    .withUpdatedAt(updatedAt)
    .withLimit(limit)
    .withOffset(offset)
    .withSort(sort)
    .build();

  festivals.getFestivalPlaces(id, search, {}, function (err, data) {

    if (err) {
      keen.errorPlace('search', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    var places = data.places.map(function (place) {
      return placeBuilders.buildPlaceResponse(place);
    });

    var response = new PlacesCollectionResponseBuilder()
      .withTotal(data.total)
      .withPlaces(places)
      .build();

    res.send(200, response);
    next();

    return keen.placesSearch(req.authorization.bearer, req.params);
  });
};

var getFestivalPlaceV1 = function getFestivalPlaceV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['place.id'], 'place.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var pid = req.params['place.id'];

  festivals.getFestivalPlace(id, pid, {}, function (err, data) {
    if (err) {
      keen.errorPlace('get', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(200, placeBuilders.buildPlaceResponse(data));
    return next();
  });
};

var deleteFestivalPlaceV1 = function deleteFestivalPlaceV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['place.id'], 'place.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var pid = req.params['place.id'];

  festivals.deleteFestivalPlace(id, pid, {}, function (err, result) {
    if (err) {
      keen.errorPlace('delete', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(204, '');
    return next();
  });
};

module.exports = {
  createFestivalPlaceV1: createFestivalPlaceV1,
  updateFestivalPlaceV1: updateFestivalPlaceV1,
  getFestivalPlacesV1: getFestivalPlacesV1,
  getFestivalPlaceV1: getFestivalPlaceV1,
  deleteFestivalPlaceV1: deleteFestivalPlaceV1
};