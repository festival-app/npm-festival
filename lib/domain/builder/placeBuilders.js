'use strict';

const uuid = require('uuid');
const moment = require('moment');

const validator = require('../../validator').validator;
const commonBuilders = require('./commonBuilders');

const PlaceDomainBuilder = require('../place').PlaceBuilder;

const festivalsModel = require('festivals-model');
const PlaceResponseBuilder = festivalsModel.model.placeResponse.PlaceResponseBuilder;

const buildPlaceResponse = function buildPlaceResponse(data) {
  if (!data) {
    return null;
  }

  const coordinates = commonBuilders.buildCoordinatesResponse(data.coordinates);
  const openingTimes = commonBuilders.buildOpeningTimesResponse(data.openingTimes);

  return new PlaceResponseBuilder()
    .withId(data.id)
    .withName(data.name)
    .withParent(data.parent)
    .withOpeningTimes(openingTimes)
    .withCoordinates(coordinates)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .build();
};

const buildPlaceDomain = function buildPlaceDomain(festivalId, params, newObject) {

  let id;
  let createdAt;
  const now = moment().toISOString();
  const validate = validator(newObject);

  const name = validate.getString(params.name, 'name');
  const parent = validate.getString(params.parent, 'parent', null);
  const openingTimes = commonBuilders.buildOpeningTimesDomain(validate, params.openingTimes);
  const coordinates = commonBuilders.buildCoordinatesDomain(validate, params.coordinates);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  const place = new PlaceDomainBuilder()
    .withId(id)
    .withParent(parent)
    .withName(name)
    .withOpeningTimes(openingTimes)
    .withCoordinates(coordinates)
    .withFestival(festivalId)
    .withCreatedAt(createdAt)
    .withUpdatedAt(now)
    .build();

  commonBuilders.removeUndefined(place);
  return place;
};

module.exports = {
  buildPlaceResponse: buildPlaceResponse,
  buildPlaceDomain: buildPlaceDomain
};