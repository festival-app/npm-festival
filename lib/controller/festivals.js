'use strict';

var options = require('config');
var logger = require('../logger/logger').logger;
var assert = require('assert-plus');
var extend = require('util')._extend;
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var ForbiddenError = myRestifyApi.error.ForbiddenError;

var festivalBuilders = require('../domain/builder/festivalBuilders');
var festivals = require('../festivals');
var keen = require('../keen');
var merger = require('../merger');
var cache = require('../cache');

var festivalsModel = require('festivals-model');

var FestivalsCollectionResponseBuilder = festivalsModel.model.festivalsCollectionResponse.FestivalsCollectionResponseBuilder;
var SearchFestivalsRequestBuilder = festivalsModel.model.searchFestivalsRequest.SearchFestivalsRequestBuilder;
var FestivalNotFoundError = festivalsModel.error.FestivalNotFoundError;

var createFestivalV1 = function createFestivalV1(req, res, next) {
  var festival = null;

  try {
    assert.object(req.params, 'params');
    festival = festivalBuilders.buildFestivalDomain(req.params, true, req.authorization.bearer.userId);
  }
  catch (e) {
    logger.warn("assert error: ", e);
    return next(new BadRequestError(e.message));
  }

  festivals.createFestival(festival, {}, function (err/*, result*/) {
    if (err) {
      keen.errorFestival('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, festivalBuilders.buildFestivalResponse(festival));
    next();
    return cache.purge(req.authorization.credentials, '/api/festivals');
  });
};


var updateFestivalV1 = function updateFestivalV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
  }
  catch (e) {
    logger.warn("assert error: ", e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.getFestival(id, options, function (err, festival) {
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

    var newFestival = festivalBuilders.buildFestivalDomain(festival, false, req.authorization.bearer.userId);

    festivals.updateFestival(id, newFestival, {}, function (errFestival/*, result*/) {
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

var getFestivalsV1 = function getFestivalsV1(req, res, next) {

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
    logger.warn("assert error: ", e);
    return next(new BadRequestError(e.message));
  }

  var name = req.params.name;
  var description = req.params.description;
  var type = req.params.type;
  var status = req.params.status;
  var dateFrom = req.params.dateFrom;
  var dateTo = req.params.dateTo;
  var locationCountry = req.params['location.country'];
  var locationName = req.params['location.name'];
  var locationCity = req.params['location.city'];
  var locationState = req.params['location.state'];
  var updatedAt = req.params.updatedAt;
  var limit = ~~req.params.limit || 100;
  var offset = ~~req.params.offset || 0;
  var sort = req.params.sort;

  if (type) {
    type = type.toLowerCase();
  }

  var searchFestivalsRequest = new SearchFestivalsRequestBuilder()
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

  festivals.getFestivals(searchFestivalsRequest, options, function (err, data) {

    if (err) {
      keen.errorFestival('search', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    var collection = data.festivals
      .filter(function (festival) {
        return !status || status=== festival.status;
      })
      .map(function (festival) {
        return festivalBuilders.buildFestivalResponse(festival);
      });

    var response = new FestivalsCollectionResponseBuilder()
      .withTotal(data.total)
      .withFestivals(collection)
      .build();

    res.send(200, response);
    next();

    return keen.festivalsSearch(req.authorization.bearer, req.params);
  });
};

var getFestivalV1 = function getFestivalV1(req, res, next) {

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
  }
  catch (e) {
    logger.warn("assert error: ", e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.getFestival(id, options, function (err, festival) {
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

var deleteFestivalV1 = function deleteFestivalV1(req, res, next) {

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
  }
  catch (e) {
    logger.warn("assert error: ", e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.getFestival(id, options, function (err, festival) {
    next.ifError(err);

    if (!festival) {
      return next(new FestivalNotFoundError('Festival not found'));
    }

    if (req.authorization.bearer.userId !== festival.userId) {
      return next(new ForbiddenError('Unable to update selected festival', 'Brak uprawnień do usunięcia wybranego festiwalu'));
    }

    festivals.deleteFestival(id, options, function (errFestival/*, result*/) {
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