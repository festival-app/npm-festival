var uuid = require('node-uuid');
var assert = require('assert-plus');
var moment = require('moment');

var commonBuilders = require('./commonBuilders');
var validator = require('../../validator').validator;

var FestivalDomainBuilder = require('../festival').FestivalBuilder;
var LocationDomainBuilder = require('../location').LocationBuilder;

var festivalsModel = require('festivals-model');
var FestivalResponseBuilder = festivalsModel.model.festivalResponse.FestivalResponseBuilder;
var LocationResponseBuilder = festivalsModel.model.locationResponse.LocationResponseBuilder;
var CountryEnum = festivalsModel.model.countryEnum.CountryEnum;

var buildLocationResponse = function buildLocationResponse(data) {
  if (!data) {
    return null;
  }

  var coordinates = commonBuilders.buildCoordinatesResponse(data.coordinates);
  var openingTimes = commonBuilders.buildOpeningTimesResponse(data.openingTimes);

  return new LocationResponseBuilder()
    .withName(data.name)
    .withState(data.state)
    .withCountry(data.country)
    .withStreet(data.street)
    .withZip(data.zip)
    .withOpeningTimes(openingTimes)
    .withCoordinates(coordinates)
    .build();
};

var buildFestivalResponse = function buildFestivalResponse(data) {
  if (!data) {
    return null;
  }

  var duration = commonBuilders.buildDurationResponse(data.duration);
  var mainImage = commonBuilders.buildMainImageResponse(data.images);

  var locations = data.locations.map(function (location) {
    return buildLocationResponse(location);
  });

  return new FestivalResponseBuilder()
    .withId(data.id)
    .withName(data.name)
    .withDescription(data.description)
    .withTags(data.tags)  //TODO
    .withMainImage(mainImage)
    .withDuration(duration)
    .withLocations(locations)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.createdAt)
    .build();
};

var buildLocationDomain = function buildLocationDomain(validate, festivalId, location, index) {
  var locationIndex = 'location[' + index + ']';
  assert.object(location, locationIndex);
  assert.optionalObject(location.coordinates, locationIndex);
  var name = validate.getString(location.name, locationIndex + '.name');
  var state = validate.getString(location.state, locationIndex + '.state');
  var country = validate.getEnum(CountryEnum.getCountry(location.country), locationIndex + '.country');
  var street = validate.getString(location.street, locationIndex + '.street');
  var zip = validate.getString(location.zip, locationIndex + '.zip', null);

  assert.arrayOfObject(location.openingTimes, locationIndex + '.openingTimes');

  var openingTimes = location.openingTimes.map(function (opening) {
    return commonBuilders.buildDurationDomain(validate, opening, locationIndex + '.openingTimes[]');
  });

  var coordinates = commonBuilders.buildCoordinatesDomain(validate, location.coordinates);

  return new LocationDomainBuilder()
    .withName(name)
    .withState(state)
    .withCountry(country)
    .withStreet(street)
    .withZip(zip)
    .withOpeningTimes(openingTimes)
    .withCoordinates(coordinates)
    .withFestival(festivalId)
    .build();
};

var buildLocationsDomain = function buildLocationsDomain(validate, id, params) {
  if (!validate.require && !params.locations) {
    return undefined;
  }

  assert.arrayOfObject(params.locations, 'locations');

  return params.locations.map(function (location) {
    return buildLocationDomain(validate, id, location, '');
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

  var festival = new FestivalDomainBuilder()
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