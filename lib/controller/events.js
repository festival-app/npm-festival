var logger = require('../logger/logger').logger;
var assert = require('assert-plus');
var festivals = require('../festivals');
var extend = require('util')._extend;
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var keen = require('../keen');
var merger = require('../merger');
var cache = require('../cache');
var eventBuilders = require('../domain/builder/eventBuilders');

var festivalsModel = require('festivals-model');
var EventsCollectionResponseBuilder = festivalsModel.model.eventsCollectionResponse.EventsCollectionResponseBuilder;
var SearchFestivalEventsRequestBuilder = festivalsModel.model.searchFestivalEventsRequest.SearchFestivalEventsRequestBuilder;
var FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;

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

  festivals.createFestivalEvent(id, event, {}, function (err/*, result*/) {
    if (err) {
      keen.errorEvent('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, eventBuilders.buildEventResponse(event));
    next();
    return cache.purge(req.authorization.credentials, '/api/festivals/' + id + '/events');
  });
};

var updateFestivalEventV1 = function updateFestivalEventV1(req, res, next) {
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

  festivals.getFestivalEvent(id, eid, {}, function (err, event) {
    if (err) {
      keen.errorEvent('update', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!event) {
      return next(new FestivalEventNotFoundError('Festival event not found'));
    }

    merger.merge(event, req.params);
    event.id = eid; //id came from festival so we need to override it
    event.category = event.category.id;
    event.place = event.place.id;

    if (req.params) {
      if (req.params.tags !== undefined) {
        //override tags from input if exists
        event.tags = req.params.tags;
      }

      if (req.params.metadata !== undefined) {
        //override metadata from input if exists
        event.metadata = req.params.metadata;
      }

      if (req.params.place !== undefined) {
        //override place from input if exists
        event.place = req.params.place;
      }

      if (req.params.category !== undefined) {
        //override category from input if exists
        event.category = req.params.category;
      }
    }

    var newEvent = eventBuilders.buildEventDomain(id, event, false);

    festivals.updateFestivalEvent(id, eid, newEvent, {}, function (err/*, result*/) {
      if (err) {
        keen.errorEvent('update', req.authorization.bearer, req.params, err);
      }
      next.ifError(err);
      res.send(200, eventBuilders.buildEventResponse(extend(event, newEvent)));
      next();
      return cache.purge(req.authorization.credentials, '/api/festivals/' + id + '/events');
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
    assert.optionalString(req.params.sort, 'sort');
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
  var sort = req.params.sort;

  var search = new SearchFestivalEventsRequestBuilder()
    .withName(name)
    .withPlace(place)
    .withStartAt(startAt)
    .withFinishAt(finishAt)
    .withCategory(category)
    .withLimit(limit)
    .withOffset(offset)
    .withSort(sort)
    .build();

  festivals.getFestivalEvents(id, search, {}, function (err, data) {

    if (err) {
      keen.errorEvent('search', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    var events = data.events.map(function (elem) {
      return eventBuilders.buildEventResponse(elem);
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

  festivals.getFestivalEvent(id, eid, {}, function (err, event) {
    if (err) {
      keen.errorEvent('get', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    if (!event) {
      return next(new FestivalEventNotFoundError('Festival event not found'));
    }

    res.send(200, eventBuilders.buildEventResponse(event));
    return next();
  });
};

var deleteFestivalEventV1 = function deleteFestivalEventV1(req, res, next) {
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

  festivals.getFestivalEvent(id, eid, {}, function (err, event) {
    if (err) {
      keen.errorEvent('delete', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    if (!event) {
      return next(new FestivalEventNotFoundError('Festival event not found'));
    }

    festivals.deleteFestivalEvent(id, eid, {}, function (err/*, result*/) {
      if (err) {
        keen.errorEvent('delete', req.authorization.bearer, req.params, err);
      }

      next.ifError(err);
      res.send(204, '');
      next();
      return cache.purge(req.authorization.credentials, '/api/festivals/' + id + '/events');
    });
  });
};

module.exports = {
  createFestivalEventV1: createFestivalEventV1,
  updateFestivalEventV1: updateFestivalEventV1,
  getFestivalEventsV1: getFestivalEventsV1,
  getFestivalEventV1: getFestivalEventV1,
  deleteFestivalEventV1: deleteFestivalEventV1
};