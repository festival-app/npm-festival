var uuid = require('node-uuid');
var assert = require('assert-plus');
var moment = require('moment');

var commonBuilders = require('./commonBuilders');
var validator = require('../../validator').validator;

var FestivalBuilder = require('../festival').FestivalBuilder;
var LocationBuilder = require('../location').LocationBuilder;

var festivalsModel = require('festivals-model');
var FestivalBuilderResponse = festivalsModel.model.festival.FestivalBuilder;
var LocationBuilderResponse = festivalsModel.model.location.LocationBuilder;
var CountryEnum = festivalsModel.model.countryEnum.CountryEnum;

var buildFestivalLocationResponse = function buildFestivalLocationResponse(data) {
  if (!data) {
    return null;
  }

  var openingTimes = commonBuilders.buildOpeningTimesResponse(data.openingTimes);

  return new LocationBuilderResponse()
    .withName(data.name)
    .withState(data.state)
    .withCountry(data.country)
    .withStreet(data.street)
    .withZip(data.zip)
    .withOpeningTimes(openingTimes)
    .build();
};

var buildFestivalResponse = function buildFestivalResponse(data) {
  if (!data) {
    return null;
  }

  var duration = commonBuilders.buildDurationResponse(data.duration);
  var mainImage = commonBuilders.buildMainImageResponse(data.images);

  var locations = data.locations.map(function (location) {
    return buildFestivalLocationResponse(location);
  });

  return new FestivalBuilderResponse()
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

var buildFestivalLocationDomain = function buildFestivalLocationDomain(validate, festivalId, location, index) {
  var locationIndex = 'location[' + index + ']';
  assert.object(location, locationIndex);
  var name = validate.getString(location.name, locationIndex + '.name');
  var state = validate.getString(location.state, locationIndex + '.state');
  var country = validate.getEnum(CountryEnum.getCountry(location.country), locationIndex + '.country');
  var street = validate.getString(location.street, locationIndex + '.street');
  var zip = validate.getString(location.zip, locationIndex + '.zip', null);

  assert.arrayOfObject(location.openingTimes, locationIndex + '.openingTimes');

  var openingTimes = location.openingTimes.map(function (opening) {
    return commonBuilders.buildDurationDomain(validate, opening, locationIndex + '.openingTimes[]');
  });

  return new LocationBuilder()
    .withName(name)
    .withState(state)
    .withCountry(country)
    .withStreet(street)
    .withZip(zip)
    .withOpeningTimes(openingTimes)
    .withFestival(festivalId)
    .build();
};

var buildLocationsDomain = function buildLocationsDomain(validate, id, params) {
  if (!validate.require && !params.locations) {
    return undefined;
  }

  assert.arrayOfObject(params.locations, 'locations');

  return params.locations.map(function (location) {
    return buildFestivalLocationDomain(validate, id, location, '');
  });

};

var buildFestivalDomain = function buildFestivalDomain(params, newObject) {

  var id;
  var createdAt;
  var now = moment().toISOString();
  var validate = validator(newObject);

  var name = validate.getString(params.name, 'name');
  var description = validate.getString(params.description, 'description');
  var tags = validate.getArrayOfString(params.tags, 'tags', []);
  var locations = buildLocationsDomain(validate, id, params);
  var images = commonBuilders.buildImagesDomain(validate, params);


  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  var festival = new FestivalBuilder()
    .withId(id)
    .withName(name)
    .withDescription(description)
    .withTags(tags)
    .withImages(images)
    .withCreatedAt(createdAt)
    .withUpdatedAt(now)
    .withDuration(commonBuilders.buildDurationDomain(validate, params.duration, 'duration'))
    .withLocations(locations)
    .build();

  commonBuilders.removeUndefined(festival);
  return festival;
};


module.exports = {
  buildFestivalResponse: buildFestivalResponse,
  buildFestivalDomain: buildFestivalDomain
};