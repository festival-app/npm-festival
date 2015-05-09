var uuid = require('node-uuid');
var moment = require('moment');

var validator = require('../../validator').validator;
var commonBuilders = require('./commonBuilders');

var PlaceBuilder = require('../place').PlaceBuilder;

var festivalsModel = require('festivals-model');
var PlaceBuilderResponse = festivalsModel.model.place.PlaceBuilder;

var buildFestivalPlaceResponse = function buildFestivalPlaceResponse(data) {
  if (!data) {
    return null;
  }

  var breadcrumbs = [];//TODO
  var openingTimes = commonBuilders.buildOpeningTimesResponse(data.openingTimes);

  return new PlaceBuilderResponse()
    .withId(data.id)
    .withName(data.name)
    .withBreadcrumbs(breadcrumbs)
    .withOpeningTimes(openingTimes)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .build();
};

var buildFestivalPlaceDomain = function buildFestivalPlaceDomain(festivalId, params, newObject) {

  var id = undefined;
  var createdAt = undefined;
  var now = moment().toISOString();
  var validate = validator(newObject);

  var name = validate.getString(params.name, 'name');
  var parent = validate.getString(params.parent, 'parent');
  var openingTimes = commonBuilders.buildOpeningTimesResponse(params.openingTimes);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  var place = new PlaceBuilder()
    .withId(id)
    .withParent(parent)
    .withName(name)
    .withOpeningTimes(openingTimes)
    .withFestival(festivalId)
    .withCreatedAt(createdAt)
    .withUpdatedAt(now)
    .build();

  commonBuilders.removeUndefined(place);
  return place;
};

module.exports = {
  buildFestivalPlaceResponse: buildFestivalPlaceResponse,
  buildFestivalPlaceDomain: buildFestivalPlaceDomain
};