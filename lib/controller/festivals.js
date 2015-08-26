var options = require('config');
var logger = require('../logger/logger').logger;
var assert = require('assert-plus');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;

var festivalBuilders = require('../domain/builder/festivalBuilders');
var festivals = require('../festivals');
var keen = require('../keen');
var merger = require('../merger');

var festivalsModel = require('festivals-model').model;

var FestivalsCollectionResponseBuilder = festivalsModel.festivalsCollectionResponse.FestivalsCollectionResponseBuilder;
var SearchFestivalsRequestBuilder = festivalsModel.searchFestivalsRequest.SearchFestivalsRequestBuilder;

var createFestivalV1 = function createFestivalV1(req, res, next) {
  var festival = null;

  try {
    assert.object(req.params, 'params');
    festival = festivalBuilders.buildFestivalDomain(req.params, true);
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  festivals.createFestival(festival, {}, function (err, data) {
    if (err) {
      keen.errorFestival('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, festivalBuilders.buildFestivalResponse(data));
    return next();
  });
};


var updateFestivalV1 = function updateFestivalV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.getFestival(id, options, function (err, data) {
    if (err) {
      keen.errorFestival('update', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    merger.merge(data, req.params);

    if (req.params) {
      if (req.params.tags !== undefined) {
        //override tags from input if exists
        data.tags = req.params.tags;
      }
    }

    var festival = festivalBuilders.buildFestivalDomain(data, false);

    festivals.updateFestival(id, festival, {}, function (err, data) {
      if (err) {
        keen.errorFestival('update', req.authorization.bearer, req.params, err);
      }
      next.ifError(err);
      res.send(200, festivalBuilders.buildFestivalResponse(data));
      return next();
    });
  });
};

var getFestivalsV1 = function getFestivalsV1(req, res, next) {

  try {
    assert.optionalString(req.params.name, 'name');
    assert.optionalString(req.params.description, 'description');
    assert.optionalString(req.params.type, 'type');
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
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var name = req.params.name;
  var description = req.params.description;
  var type = req.params.type;
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

    var festivals = data.festivals.map(function (festival) {
      return festivalBuilders.buildFestivalResponse(festival);
    });

    var response = new FestivalsCollectionResponseBuilder()
      .withTotal(data.total)
      .withFestivals(festivals)
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
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.getFestival(id, options, function (err, data) {
    if (err) {
      keen.errorFestival('get', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(200, festivalBuilders.buildFestivalResponse(data));
    return next();
  });
};

var deleteFestivalV1 = function deleteFestivalV1(req, res, next) {

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.deleteFestival(id, options, function (err, result) {
    if (err) {
      keen.errorFestival('delete', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(204, '');
    return next();
  });
};

module.exports = {
  createFestivalV1: createFestivalV1,
  updateFestivalV1: updateFestivalV1,
  getFestivalsV1: getFestivalsV1,
  getFestivalV1: getFestivalV1,
  deleteFestivalV1: deleteFestivalV1
};