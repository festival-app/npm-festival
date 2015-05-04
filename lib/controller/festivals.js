var options = require('config');
var assert = require('assert-plus');
var festivals = require('../festivals');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var SearchFestivalsRequestBuilder = require('festivals-model').model.searchFestivalsRequest.SearchFestivalsRequestBuilder;
var keen = require('../keen');

var festivalsModel = require('festivals-model');
var FestivalBuilder = festivalsModel.model.festival.FestivalBuilder;
var DurationBuilder = festivalsModel.model.duration.DurationBuilder;
var LocationBuilder = festivalsModel.model.location.LocationBuilder;
var ImageBuilder = festivalsModel.model.image.ImageBuilder;
var FestivalsCollectionBuilder = festivalsModel.model.festivalsCollection.FestivalsCollectionBuilder;

var domain = require('domain');

var buildFestivalLocation = function buildFestivalLocation(data) {
  if (!data) {
    return null;
  }

  return new LocationBuilder()
    .withName(data.name)
    .withState(data.state)
    .withCountry(data.country)
    .withStreet(data.street)
    .withZip(data.zip)
    .withOpeningTimes(data.openingTimes) //TODO map
    .build();
};

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

  var locations = [];
  if (data.locations) {
    for (var i in data.locations) {
      if (data.locations.hasOwnProperty(i)) {
        var location = buildFestivalLocation(data.locations[i]);

        if (location) {
          locations.push(location);
        }
      }
    }
  }

  return new FestivalBuilder()
    .withId(data.id)
    .withName(data.name)
    .withDescription(data.description)
    .withTags(data.tags)  //TODO
    .withMainImage(mainImage)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.createdAt)
    .withDuration(duration)
    .withLocations(locations)
    .build();
};

var getFestivalsV1 = function getFestivalsV1(req, res, next) {
  var d = domain.create();
  d.add(req);
  d.add(res);

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

  d.run(function () {
    festivals.getFestivals(searchFestivalsRequest, options, function (err, data) {

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

      var response = new FestivalsCollectionBuilder()
        .withTotal(data.total)
        .withFestivals(festivals)
        .build();

      res.send(200, response);
      next();

      return keen.festivalsSearch(req.authorization.bearer, req.params);
    });
  });
};

var getFestivalV1 = function getFestivalV1(req, res, next) {
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
  getFestivalsV1: getFestivalsV1,
  getFestivalV1: getFestivalV1
};