'use strict';

const uuid = require('uuid');
const assert = require('assert-plus');
const moment = require('moment');

const commonBuilders = require('./commonBuilders');
const validator = require('../../validator').validator;

const FestivalDomainBuilder = require('../festival').FestivalBuilder;
const LocationDomainBuilder = require('../location').LocationBuilder;

const festivalsModel = require('festivals-model');
const FestivalResponseBuilder = festivalsModel.model.festivalResponse.FestivalResponseBuilder;
const LocationResponseBuilder = festivalsModel.model.locationResponse.LocationResponseBuilder;
const CountryEnum = festivalsModel.model.countryEnum.CountryEnum;
const FestivalStatusEnum = festivalsModel.model.festivalStatusEnum.FestivalStatusEnum;
const FestivalTypeEnum = festivalsModel.model.festivalTypeEnum.FestivalTypeEnum;

const buildLocationResponse = function buildLocationResponse(data) {
  if (!data) {
    return null;
  }

  const coordinates = commonBuilders.buildCoordinatesResponse(data.coordinates);
  const openingTimes = commonBuilders.buildOpeningTimesResponse(data.openingTimes);

  return new LocationResponseBuilder()
    .withName(data.name)
    .withState(data.state)
    .withCountry(data.country)
    .withStreet(data.street)
    .withCity(data.city)
    .withZip(data.zip)
    .withOpeningTimes(openingTimes)
    .withCoordinates(coordinates)
    .build();
};

const buildFestivalResponse = function buildFestivalResponse(data) {
  if (!data) {
    return null;
  }

  const duration = commonBuilders.buildDurationResponse(data.duration);
  const mainImage = commonBuilders.buildMainImageResponse(data.images);

  const locations = data.locations.map(location => buildLocationResponse(location));

  return new FestivalResponseBuilder()
    .withId(data.id)
    .withName(data.name)
    .withDescription(data.description)
    .withType(data.type)
    .withStatus(data.status)
    .withTags(data.tags)
    .withMainImage(mainImage)
    .withDuration(duration)
    .withLocations(locations)
    .withPublishedAt(null)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .build();
};

const buildLocationDomain = function buildLocationDomain(validate, festivalId, location, index) {
  const locationIndex = `location[${index}]`;
  assert.object(location, locationIndex);
  assert.optionalObject(location.coordinates, locationIndex);
  const name = validate.getString(location.name, `${locationIndex}.name`);
  const state = validate.getString(location.state, `${locationIndex}.state`);
  const country = validate.getEnum(CountryEnum.getCountry(location.country), `${locationIndex}.country`);
  const street = validate.getString(location.street, `${locationIndex}.street`);
  const zip = validate.getString(location.zip, `${locationIndex}.zip`, null);
  const city = validate.getString(location.city, `${locationIndex}.city`, null);

  assert.arrayOfObject(location.openingTimes, `${locationIndex}.openingTimes`);

  const openingTimes = location.openingTimes.map(opening => commonBuilders.buildDurationDomain(validate, opening, `${locationIndex}.openingTimes[]`));

  const coordinates = commonBuilders.buildCoordinatesDomain(validate, location.coordinates);

  return new LocationDomainBuilder()
    .withName(name)
    .withState(state)
    .withCountry(country)
    .withStreet(street)
    .withCity(city)
    .withZip(zip)
    .withOpeningTimes(openingTimes)
    .withCoordinates(coordinates)
    .withFestival(festivalId)
    .build();
};

const buildLocationsDomain = function buildLocationsDomain(validate, id, params) {
  if (!validate.require && !params.locations) {
    return undefined;
  }

  assert.arrayOfObject(params.locations, 'locations');

  return params.locations.map(location => buildLocationDomain(validate, id, location, ''));

};

const buildFestivalDomain = function buildFestivalDomain(params, newObject, user) {

  let id;
  let createdAt;
  let userId;
  const now = moment().toISOString();
  const validate = validator(newObject);

  const name = validate.getString(params.name, 'name');
  const type = validate.getEnum(FestivalTypeEnum.getType(params.type), 'type');
  const status = validate.getEnum(FestivalStatusEnum.getStatus(params.status), 'status', FestivalStatusEnum.CREATED);

  const description = validate.getString(params.description, 'description');
  const tags = validate.getArrayOfString(params.tags, 'tags', []);
  const locations = buildLocationsDomain(validate, id, params);
  const images = commonBuilders.buildImagesDomain(validate, params);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
    userId = user;
  }

  const festival = new FestivalDomainBuilder()
    .withId(id)
    .withName(name)
    .withDescription(description)
    .withType(type)
    .withStatus(status)
    .withTags(tags)
    .withImages(images)
    .withCreatedAt(createdAt)
    .withUpdatedAt(now)
    .withDuration(commonBuilders.buildDurationDomain(validate, params.duration, 'duration'))
    .withLocations(locations)
    .withUserId(userId)
    .build();

  commonBuilders.removeUndefined(festival);
  return festival;
};


module.exports = {
  buildFestivalResponse: buildFestivalResponse,
  buildFestivalDomain: buildFestivalDomain
};