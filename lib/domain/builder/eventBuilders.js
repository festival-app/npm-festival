var uuid = require('node-uuid');
var moment = require('moment');

var validator = require('../../validator').validator;
var commonBuilders = require('./commonBuilders');

var EventDomainBuilder = require('../event').EventBuilder;

var festivalsModel = require('festivals-model');
var EventResponseBuilder = festivalsModel.model.eventResponse.EventResponseBuilder;
var EventPlaceResponseBuilder = festivalsModel.model.eventPlaceResponse.EventPlaceResponseBuilder;
var EventCategoryResponseBuilder = festivalsModel.model.eventCategoryResponse.EventCategoryResponseBuilder;

var EventStatusEnum = festivalsModel.model.eventStatusEnum.EventStatusEnum;

var buildEventPlaceResponse = function buildEventPlaceResponse(data) {
  if (!data) {
    return null;
  }

  var name = data.name || null;
  var breadcrumbs = data.parents || [];
  var coordinates = commonBuilders.buildCoordinatesResponse(data.coordinates);
  var openingTimes = commonBuilders.buildOpeningTimesResponse(data.openingTimes);

  return new EventPlaceResponseBuilder()
    .withId(data.id)
    .withName(name)
    .withBreadcrumbs(breadcrumbs)
    .withOpeningTimes(openingTimes)
    .withCoordinates(coordinates)
    .build();
};

var buildEventCategoryResponse = function buildEventCategoryResponse(data) {
  if (!data) {
    return null;
  }

  var name = data.name || null;
  var breadcrumbs = data.parents || [];
  return new EventCategoryResponseBuilder()
    .withId(data.id)
    .withName(name)
    .withBreadcrumbs(breadcrumbs)
    .build();
};


var buildEventResponse = function buildEventResponse(data) {
  if (!data) {
    return null;
  }

  var duration = commonBuilders.buildDurationResponse(data.duration);
  var mainImage = commonBuilders.buildMainImageResponse(data.images);
  var eventPlace = buildEventPlaceResponse(data.place);
  var eventCategory = buildEventCategoryResponse(data.category);
  var authors = commonBuilders.buildAuthorResponse(data.authors);
  var status = data.status || EventStatusEnum.PUBLISHED;

  return new EventResponseBuilder()
    .withId(data.id)
    .withName(data.name)
    .withDescription(data.description)
    .withStatus(status)
    .withTags(data.tags)
    .withMainImage(mainImage)
    .withDuration(duration)
    .withPlace(eventPlace)
    .withCategory(eventCategory)
    .withAuthors(authors)
    .withPublishedAt(null)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .build();
};

var buildEventDomain = function buildEventDomain(festivalId, params, newObject) {

  var id;
  var createdAt;
  var now = moment().toISOString();
  var validate = validator(newObject);

  var name = validate.getString(params.name, 'name');
  var description = validate.getString(params.description, 'description');
  var status = validate.getEnum(EventStatusEnum.getStatus(params.status), 'status', EventStatusEnum.CREATED);
  var tags = validate.getArrayOfString(params.tags, 'tags', []);
  var metadata = validate.getArrayOfString(params.metadata, 'metadata', []);
  var images = commonBuilders.buildImagesDomain(validate, params);
  var place = validate.getString(params.place, 'place');
  var category = validate.getString(params.category, 'category');
  var duration = commonBuilders.buildDurationDomain(validate, params.duration, 'duration');
  var authors = commonBuilders.buildAuthorDomain(params.authors);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  var event = new EventDomainBuilder()
    .withId(id)
    .withName(name)
    .withDescription(description)
    .withStatus(status)
    .withTags(tags)
    .withAuthors(authors)
    .withImages(images)
    .withCreatedAt(createdAt)
    .withUpdatedAt(now)
    .withDuration(duration)
    .withPlace(place)
    .withCategory(category)
    .withFestival(festivalId)
    .withMetadata(metadata)
    .build();

  commonBuilders.removeUndefined(event);
  return event;
};

module.exports = {
  buildEventResponse: buildEventResponse,
  buildEventDomain: buildEventDomain
};