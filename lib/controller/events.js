var logger = require('../logger/logger').logger;
var options = require('config');
var assert = require('assert-plus');
var async = require('async');
var festivals = require('../festivals');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var keen = require('../keen');
var eventBuilders = require('../domain/builder/eventBuilders');

var festivalsModel = require('festivals-model').model;
var EventsCollectionResponseBuilder = festivalsModel.eventsCollectionResponse.EventsCollectionResponseBuilder;
var SearchFestivalEventsRequestBuilder = festivalsModel.searchFestivalEventsRequest.SearchFestivalEventsRequestBuilder;

var getPlaceAndCategory = function getPlaceAndCategory(id, place, category, callback) {

  async.parallel({
    place: function (cb) {
      festivals.getFestivalPlace(id, place, {}, cb);
    },
    category: function (cb) {
      festivals.getFestivalCategory(id, category, {}, cb);
    }
  }, callback);
};

var createFestivalEventV1 = function createFestivalEventV1(req, res, next) {
  var event = null;

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    event = eventBuilders.buildEventDomain(req.params.id, req.params, true);
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  festivals.createFestivalEvent(id, event, {}, function (err, data) {
    next.ifError(err);

    if (!data) {
      return null; //TODO
    }

    getPlaceAndCategory(id, data.place, data.category, function (err, result) {
      next.ifError(err);

      res.send(201, eventBuilders.buildEventResponse(data, result.place, result.category));
      return next();
    });
  });
};

var updateFestivalEventV1 = function updateFestivalEventV1(req, res, next) {
  var event = null;

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['event.id'], 'event.id');
    event = eventBuilders.buildEventDomain(req.params.id, req.params, false);
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var eid = req.params['event.id'];

  festivals.updateFestivalEvent(id, eid, event, {}, function (err, data) {

    getPlaceAndCategory(id, data.place, data.category, function (err, result) {
      next.ifError(err);
      res.send(200, eventBuilders.buildEventResponse(data, result.place, result.category));
      return next();
    });
  });
};

var getFestivalEventsV1 = function getFestivalEventsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');

    assert.optionalString(req.params.startAt, 'startAt');
    assert.optionalString(req.params.limit, 'limit');
    assert.optionalString(req.params.offset, 'offset');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var name = req.params.name || null;
  var place = req.params.place || null;
  var category = req.params.category || null;
  var startAt = req.params.startAt || null;
  var finishAt = req.params.finishAt || null;
  var limit = ~~req.params.limit || 500;
  var offset = ~~req.params.offset;

  var search = new SearchFestivalEventsRequestBuilder()
    .withName(name)
    .withPlace(place)
    .withStartAt(startAt)
    .withFinishAt(finishAt)
    .withCategory(category)
    .withLimit(limit)
    .withOffset(offset)
    .build();

  festivals.getFestivalEvents(id, search, options, function (err, data) {

    if (err) {
      keen.errorEvent(req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    var events =  data.events.map(function (event) {
      return eventBuilders.buildEventResponse(event);
    });

    var response = new EventsCollectionResponseBuilder()
      .withTotal(data.total)
      .withEvents(events)
      .build();

    res.send(200, response);
    next();

    return keen.eventsSearch(req.authorization.bearer, req.params);
  });
};

var getFestivalEventV1 = function getFestivalEventV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['event.id'], 'event.id');
  }
  catch (e) {
    logger.warn(e);
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;
  var eid = req.params['event.id'];

  festivals.getFestivalEvent(id, eid, options, function (err, data) {

    next.ifError(err);

    getPlaceAndCategory(id, data.place, data.category, function (err, result) {
      next.ifError(err);
      res.send(200, eventBuilders.buildEventResponse(data, result.place, result.category));
      return next();
    });
  });
};

module.exports = {
  createFestivalEventV1: createFestivalEventV1,
  updateFestivalEventV1: updateFestivalEventV1,
  getFestivalEventsV1: getFestivalEventsV1,
  getFestivalEventV1: getFestivalEventV1
};