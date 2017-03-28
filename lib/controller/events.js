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
const eventBuilders = require('../domain/builder/eventBuilders');

const festivalsModel = require('festivals-model');
const EventsCollectionResponseBuilder = festivalsModel.model.eventsCollectionResponse.EventsCollectionResponseBuilder;
const SearchFestivalEventsRequestBuilder = festivalsModel.model.searchFestivalEventsRequest.SearchFestivalEventsRequestBuilder;
const FestivalEventNotFoundError = festivalsModel.error.FestivalEventNotFoundError;

const createFestivalEventV1 = function createFestivalEventV1(req, res, next) {
  let event = null;

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    event = eventBuilders.buildEventDomain(req.params.id, req.params, true);
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;

  return festivals.createFestivalEvent(id, event, {}, err/*, result*/ => {
    if (err) {
      keen.errorEvent('create', req.authorization.bearer, req.params, err);
    }
    next.ifError(err);

    res.send(201, eventBuilders.buildEventResponse(event));
    next();
    return cache.purge(req.authorization.credentials, `/api/festivals/${id}/events`);
  });
};

const updateFestivalEventV1 = function updateFestivalEventV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['event.id'], 'event.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const eid = req.params['event.id'];

  return festivals.getFestivalEvent(id, eid, {}, (err, event) => {
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

    const newEvent = eventBuilders.buildEventDomain(id, event, false);

    return festivals.updateFestivalEvent(id, eid, newEvent, {}, errEvent/*, result*/ => {
      if (errEvent) {
        keen.errorEvent('update', req.authorization.bearer, req.params, errEvent);
      }
      next.ifError(errEvent);
      res.send(200, eventBuilders.buildEventResponse(extend(event, newEvent)));
      next();
      return cache.purge(req.authorization.credentials, `/api/festivals/${id}/events`);
    });
  });
};

const getFestivalEventsV1 = function getFestivalEventsV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');

    assert.optionalString(req.params.startAt, 'startAt');
    assert.optionalString(req.params.limit, 'limit');
    assert.optionalString(req.params.offset, 'offset');
    assert.optionalString(req.params.sort, 'sort');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const name = req.params.name || null;
  const place = req.params.place || null;
  const category = req.params.category || null;
  const startAt = req.params.startAt || null;
  const finishAt = req.params.finishAt || null;
  const limit = ~~req.params.limit || 500;
  const offset = ~~req.params.offset;
  const sort = req.params.sort;

  const search = new SearchFestivalEventsRequestBuilder()
    .withName(name)
    .withPlace(place)
    .withStartAt(startAt)
    .withFinishAt(finishAt)
    .withCategory(category)
    .withLimit(limit)
    .withOffset(offset)
    .withSort(sort)
    .build();

  return festivals.getFestivalEvents(id, search, {}, (err, data) => {

    if (err) {
      keen.errorEvent('search', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    const events = data.events.map(elem => eventBuilders.buildEventResponse(elem));

    const response = new EventsCollectionResponseBuilder()
      .withTotal(data.total)
      .withEvents(events)
      .build();

    res.send(200, response);
    next();

    return keen.eventsSearch(req.authorization.bearer, req.params);
  });
};

const getFestivalEventV1 = function getFestivalEventV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['event.id'], 'event.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const eid = req.params['event.id'];

  return festivals.getFestivalEvent(id, eid, {}, (err, event) => {
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

const deleteFestivalEventV1 = function deleteFestivalEventV1(req, res, next) {
  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
    assert.string(req.params['event.id'], 'event.id');
  }
  catch (e) {
    logger.warn('assert error: ', e);
    return next(new BadRequestError(e.message));
  }

  const id = req.params.id;
  const eid = req.params['event.id'];

  return festivals.getFestivalEvent(id, eid, {}, (err, event) => {
    if (err) {
      keen.errorEvent('delete', req.authorization.bearer, req.params, err);
    }

    next.ifError(err);

    if (!event) {
      return next(new FestivalEventNotFoundError('Festival event not found'));
    }

    return festivals.deleteFestivalEvent(id, eid, {}, errEvent/*, result*/ => {
      if (errEvent) {
        keen.errorEvent('delete', req.authorization.bearer, req.params, errEvent);
      }

      next.ifError(errEvent);
      res.send(204, '');
      next();
      return cache.purge(req.authorization.credentials, `/api/festivals/${id}/events`);
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