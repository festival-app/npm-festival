var options = require('config');
var assert = require('assert-plus');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;

var festivalBuilders = require('../domain/builder/festivalBuilders');
var festivals = require('../festivals');
var keen = require('../keen');

var festivalsModel = require('festivals-model');

var FestivalsCollectionBuilder = festivalsModel.model.festivalsCollection.FestivalsCollectionBuilder;
var SearchFestivalsRequestBuilder = festivalsModel.model.searchFestivalsRequest.SearchFestivalsRequestBuilder;

var createFestivalV1 = function createFestivalV1(req, res, next) {
  var festival = null;

  try {
    assert.object(req.params, 'params');
    festival = festivalBuilders.buildFestivalDomain(req.params, true);
  }
  catch (e) {
    return next(new BadRequestError(e.message));
  }

  festivals.createFestival(festival, {}, function (err, data) {
    next.ifError(err);

    res.send(201, festivalBuilders.buildFestivalResponse(data));
    return next();
  });
};

var updateFestivalV1 = function updateFestivalV1(req, res, next) {
  var festival = null;

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    festival = festivalBuilders.buildFestivalDomain(req.params, false);

  }
  catch (e) {
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.updateFestival(id, festival, {}, function (err, data) {
    next.ifError(err);
    res.send(200, festivalBuilders.buildFestivalResponse(data));
    return next();
  });
};

var getFestivalsV1 = function getFestivalsV1(req, res, next) {

  try {
    assert.optionalString(req.params.name, 'name');
    assert.optionalString(req.params.country, 'country');
    assert.optionalString(req.params.startAt, 'startAt');
    assert.optionalString(req.params.limit, 'limit');
    assert.optionalString(req.params.offset, 'offset');
  }
  catch (e) {
    return next(new BadRequestError(e.message));
  }

  var name = req.params.name || null;
  var country = req.params.country || null;
  var startAt = req.params.startAt || null;
  var limit = ~~req.params.limit || null;
  var offset = ~~req.params.offset || 0;

  var searchFestivalsRequest = new SearchFestivalsRequestBuilder()
    .withName(name)
    .withCountry(country)
    .withStartAt(startAt)
    .withLimit(limit)
    .withOffset(offset)
    .build();

  festivals.getFestivals(searchFestivalsRequest, options, function (err, data) {

    if (err) {
      keen.errorFestival(req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    var festivals = [];

    if (data.festivals) {
      for (var i in data.festivals) {
        if (data.festivals.hasOwnProperty(i)) {
          var festival = festivalBuilders.buildFestivalResponse(data.festivals[i]);

          if (festival) {
            festivals.push(festival);
          }
        }
      }
    }

    var response = new FestivalsCollectionBuilder()
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
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.getFestival(id, options, function (err, data) {

    next.ifError(err);

    res.send(200, festivalBuilders.buildFestivalResponse(data));
    return next();
  });
};

module.exports = {
  createFestivalV1: createFestivalV1,
  updateFestivalV1: updateFestivalV1,
  getFestivalsV1: getFestivalsV1,
  getFestivalV1: getFestivalV1
};