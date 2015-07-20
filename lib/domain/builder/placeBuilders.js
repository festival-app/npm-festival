var uuid = require('node-uuid');
var moment = require('moment');

var validator = require('../../validator').validator;
var commonBuilders = require('./commonBuilders');

var PlaceDomainBuilder = require('../place').PlaceBuilder;

var festivalsModel = require('festivals-model');
var PlaceResponseBuilder = festivalsModel.model.placeResponse.PlaceResponseBuilder;

var buildPlaceResponse = function buildPlaceResponse(data) {
  if (!data) {
    return null;
  }

  var coordinates = commonBuilders.buildCoordinatesResponse(data.coordinates);
  var openingTimes = commonBuilders.buildOpeningTimesResponse(data.openingTimes);

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

var buildPlaceDomain = function buildPlaceDomain(festivalId, params, newObject) {

  var id;
  var createdAt;
  var now = moment().toISOString();
  var validate = validator(newObject);

  var name = validate.getString(params.name, 'name');
  var parent = validate.getString(params.parent, 'parent', null);
  var openingTimes = commonBuilders.buildOpeningTimesDomain(params.openingTimes);
  var coordinates = commonBuilders.buildCoordinatesDomain(validate, params.coordinates);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  var place = new PlaceDomainBuilder()
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