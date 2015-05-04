var options = require('config');
var assert = require('assert-plus');
var festivals = require('../festivals');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var keen = require('../keen');

var festivalsModel = require('festivals-model');
var EventBuilder = festivalsModel.model.event.EventBuilder;
var DurationBuilder = festivalsModel.model.duration.DurationBuilder;
var ImageBuilder = festivalsModel.model.image.ImageBuilder;
var PlaceBuilder = festivalsModel.model.place.PlaceBuilder;
var EventsCollectionBuilder = festivalsModel.model.eventsCollection.EventsCollectionBuilder;
var SearchFestivalEventsRequestBuilder = festivalsModel.model.searchFestivalEventsRequest.SearchFestivalEventsRequestBuilder;

var domain = require('domain');

var buildFestival = function buildFestival(data) {
  if (!data) {
    return null;
  }

  var duration = new DurationBuilder()
    .withStartAt(data.duration.startAt)
    .withFinishAt(data.duration.finishAt)
    .withPeriodMs(data.duration.periodMs)
    .build();

  var mainImage = new ImageBuilder()
    .withSmall(data.mainImage.small)
    .withMedium(data.mainImage.medium)
    .withLarge(data.mainImage.large)
    .build();

  var place = new PlaceBuilder()
    .withId(data.place.id)
    .withParent(data.place.parent)
    .withName(data.place.name)
    .withOpeningTimes(data.place.openingTimes)  //TODO
    .build();

  return new EventBuilder()
    .withId(data.id)
    .withName(data.name)
    .withDescription(data.description)
    .withTags(data.tags)  //TODO
    .withMainImage(mainImage)
    .withDuration(duration)
    .withPlace(place)
    .withCategory(data.category)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.createdAt)
    .build();
};

var getFestivalEventsV1 = function getFestivalEventsV1(req, res, next) {
  var d = domain.create();
  d.add(req);
  d.add(res);

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');

    assert.optionalString(req.params.startAt, 'startAt');
    assert.optionalString(req.params.limit, 'limit');
    assert.optionalString(req.params.offset, 'offset');
  }
  catch (e) {
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  var search = new SearchFestivalEventsRequestBuilder()
    //.withName(name)
    //.withPlace(place)
    .withStartAt(startAt)
    //.withFinishAt(finishAt)
    //.withCategory(category)
    .withLimit(limit)
    .withOffset(offset)
    .build();

  d.run(function () {
    festivals.getFestivalEvents(id, search, options, function (err, data) {

      if (err) {
        keen.errorEvent(req.authorization.bearer, req.params, err);
      }

      next.ifError(err);

      var festivals = [];

      if (data.festivals) {
        for (var i in data.festivals) {
          if (data.festivals.hasOwnProperty(i)) {
            var festival = buildFestival(data.festivals[i]);

            if (festival) {
              festivals.push(festival);
            }
          }
        }
      }

      var response = new EventsCollectionBuilder()
        .withTotal(data.total)
        .withFestivals(festivals)
        .build();

      res.send(200, response);
      next();

      return keen.festivalsSearch(req.authorization.bearer, req.params);
    });
  });
};

var getFestivalEventV1 = function getFestivalEventV1(req, res, next) {
  var d = domain.create();
  d.add(req);
  d.add(res);

  try {
    assert.object(req.params, 'params');
    assert.string(req.params.id, 'id');
  }
  catch (e) {
    return next(new BadRequestError(e.message));
  }

  var id = req.params.id;

  d.run(function () {
    festivals.getFestival(id, options, function (err, data) {

      if (err) {
        keen.errorEvent(req.authorization.bearer, req.params, err);
      }

      next.ifError(err);

      res.send(200, buildFestival(data));
      next();

      return keen.festivalsSearch(req.authorization.bearer, req.params);
    });
  });
};

module.exports = {
  getFestivalEventsV1: getFestivalEventsV1,
  getFestivalEventV1: getFestivalEventV1
};