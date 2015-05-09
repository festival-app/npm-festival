var uuid = require('node-uuid');
var moment = require('moment');

var validator = require('../../validator').validator;
var commonBuilders = require('./commonBuilders');

var EventBuilder = require('../event').EventBuilder;

var festivalsModel = require('festivals-model');
var EventBuilderResponse = festivalsModel.model.event.EventBuilder;
var PlaceBuilder = festivalsModel.model.place.PlaceBuilder;

var buildPlaceResponse = function buildPlaceResponse(data) {
  if (!data) {
    return null;
  }

  var breadcrumbs = [];//TODO
  var openingTimes = commonBuilders.buildOpeningTimesResponse(data.openingTimes);

  return new PlaceBuilder()
    .withId(data.id)
    .withName(data.name)
    //.withBreadcrumbs(breadcrumbs) //TODO
    .withOpeningTimes(openingTimes)
    .build();
};

var buildFestivalEventResponse = function buildFestivalEventResponse(data) {
  if (!data) {
    return null;
  }

  var duration = commonBuilders.buildDurationResponse(data.duration);
  var mainImage = commonBuilders.buildMainImageResponse(data.images);
  var place = buildPlaceResponse(data.place);

  return new EventBuilderResponse()
    .withId(data.id)
    .withName(data.name)
    .withDescription(data.description)
    .withTags(data.tags)  //TODO
    .withMainImage(mainImage)
    .withDuration(duration)
    .withPlace(place)
    //.withCategory(data.category)  //TODO
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .build();
};

var buildFestivalEventDomain = function buildFestivalEventDomain(festivalId, params, newObject) {

  var id = undefined;
  var createdAt = undefined;
  var now = moment().toISOString();
  var validate = validator(newObject);

  var name = validate.getString(params.name, 'name');
  var description = validate.getString(params.description, 'description');
  var tags = validate.getArrayOfString(params.tags, 'tags', []);
  var images = commonBuilders.buildImagesDomain(validate, params);
  var place = validate.getString(params.place, 'place');
  var category = validate.getString(params.category, 'category');

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  var event = new EventBuilder()
    .withId(id)
    .withName(name)
    .withDescription(description)
    .withTags(tags)
    .withImages(images)
    .withCreatedAt(createdAt)
    .withUpdatedAt(now)
    .withDuration(commonBuilders.buildDurationDomain(validate, params.duration, 'duration'))
    .withPlace(place)
    .withCategory(category)
    .withFestival(festivalId)
    .build();

  commonBuilders.removeUndefined(event);
  return event;
};

module.exports = {
  buildFestivalEventResponse: buildFestivalEventResponse,
  buildFestivalEventDomain: buildFestivalEventDomain
};