'use strict';

const uuid = require('uuid');
const moment = require('moment');

const validator = require('../../validator').validator;
const commonBuilders = require('./commonBuilders');

const EventDomainBuilder = require('../event').EventBuilder;

const festivalsModel = require('festivals-model');
const EventResponseBuilder = festivalsModel.model.eventResponse.EventResponseBuilder;
const EventPlaceResponseBuilder = festivalsModel.model.eventPlaceResponse.EventPlaceResponseBuilder;
const EventCategoryResponseBuilder = festivalsModel.model.eventCategoryResponse.EventCategoryResponseBuilder;

const EventStatusEnum = festivalsModel.model.eventStatusEnum.EventStatusEnum;

const buildEventPlaceResponse = function buildEventPlaceResponse(data) {
  if (!data) {
    return null;
  }

  const name = data.name || null;
  const breadcrumbs = data.parents || [];
  const coordinates = commonBuilders.buildCoordinatesResponse(data.coordinates);
  const openingTimes = commonBuilders.buildOpeningTimesResponse(data.openingTimes);

  return new EventPlaceResponseBuilder()
    .withId(data.id)
    .withName(name)
    .withBreadcrumbs(breadcrumbs)
    .withOpeningTimes(openingTimes)
    .withCoordinates(coordinates)
    .build();
};

const buildEventCategoryResponse = function buildEventCategoryResponse(data) {
  if (!data) {
    return null;
  }

  const name = data.name || null;
  const breadcrumbs = data.parents || [];
  return new EventCategoryResponseBuilder()
    .withId(data.id)
    .withName(name)
    .withBreadcrumbs(breadcrumbs)
    .build();
};


const buildEventResponse = function buildEventResponse(data) {
  if (!data) {
    return null;
  }

  const duration = commonBuilders.buildDurationResponse(data.duration);
  const mainImage = commonBuilders.buildMainImageResponse(data.images);
  const eventPlace = buildEventPlaceResponse(data.place);
  const eventCategory = buildEventCategoryResponse(data.category);
  const authors = commonBuilders.buildAuthorResponse(data.authors);
  const status = data.status || EventStatusEnum.PUBLISHED;

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

const buildEventDomain = function buildEventDomain(festivalId, params, newObject) {

  let id;
  let createdAt;
  const now = moment().toISOString();
  const validate = validator(newObject);

  const name = validate.getString(params.name, 'name');
  const description = validate.getString(params.description, 'description');
  const status = validate.getEnum(EventStatusEnum.getStatus(params.status), 'status', EventStatusEnum.CREATED);
  const tags = validate.getArrayOfString(params.tags, 'tags', []);
  const metadata = validate.getArrayOfString(params.metadata, 'metadata', []);
  const images = commonBuilders.buildImagesDomain(validate, params);
  const place = validate.getString(params.place, 'place');
  const category = validate.getString(params.category, 'category');
  const duration = commonBuilders.buildDurationDomain(validate, params.duration, 'duration');
  const authors = commonBuilders.buildAuthorDomain(params.authors);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  const event = new EventDomainBuilder()
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