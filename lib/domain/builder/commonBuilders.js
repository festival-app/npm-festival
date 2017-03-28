'use strict';

const assert = require('assert-plus');
const moment = require('moment');

const DurationDomainBuilder = require('../duration').DurationBuilder;
const ImageDomainBuilder = require('../image').ImageBuilder;
const CoordinatesDomainBuilder = require('../coordinates').CoordinatesBuilder;
const AuthorDomainBuilder = require('../author').AuthorBuilder;

const festivalsModel = require('festivals-model');
const DurationResponseBuilder = festivalsModel.model.durationResponse.DurationResponseBuilder;
const MainImageResponseBuilder = festivalsModel.model.mainImageResponse.MainImageResponseBuilder;
const CoordinatesResponseBuilder = festivalsModel.model.coordinatesResponse.CoordinatesResponseBuilder;
const AuthorResponseBuilder = festivalsModel.model.authorResponse.AuthorResponseBuilder;

const buildDurationResponse = function buildDurationResponse(data) {

  let duration = null;

  const start = moment(data.startAt);
  const end = moment(data.finishAt);

  if (end && start) {
    const periodDuration = moment.duration(end.diff(start));
    const periodMs = periodDuration.asMilliseconds();

    duration = new DurationResponseBuilder()
      .withStartAt(start.toISOString())
      .withFinishAt(end.toISOString())
      .withPeriodMs(periodMs)
      .build();
  }

  return duration;
};

const buildDurationDomain = function buildDurationDomain(validate, duration, prefix) {
  if (!validate.require && !duration) {
    return undefined;
  }

  assert.object(duration, prefix);

  const durationStartAt = validate.getDate(duration.startAt, `${prefix}.startAt`);
  const durationFinishAt = validate.getDate(duration.finishAt, `${prefix}.finishAt`);

  return new DurationDomainBuilder()
    .withStartAt(durationStartAt.toISOString())
    .withFinishAt(durationFinishAt.toISOString())
    .build();
};

const buildImageDomain = function buildImageDomain(validate, image, prefix) {
  assert.object(image, prefix);

  const url = validate.getString(image.url, `${prefix}.url`, null);
  const content = validate.getString(image.content, `${prefix}.content`, null);
  const order = validate.getNumber(image.order, `${prefix}.order`, 0);

  if (!url && !content) {
    assert.ok(null, 'one of url (string) or content (string) is required');
  }

  return new ImageDomainBuilder()
    .withUrl(url)
    .withContent(content)
    .withOrder(order)
    .build();
};

const buildImagesDomain = function buildImagesDomain(validate, params) {
  if (!validate.require && !params.images) {
    return undefined;
  }

  assert.arrayOfObject(params.images, 'images');

  return params.images.map(image => buildImageDomain(validate, image, 'images[]'));
};

const buildOpeningTimesResponse = function buildOpeningTimesResponse(openingTimes) {

  if (!openingTimes || openingTimes.length < 1) {
    return [];
  }

  return openingTimes.map(opening => buildDurationResponse(opening));

};

const buildOpeningTimesDomain = function buildOpeningTimesDomain(validate, openingTimes) {

  if (!openingTimes || openingTimes.length < 1) {
    return [];
  }

  return openingTimes.map(opening => buildDurationDomain(validate, opening, ''));

};

const buildCoordinatesResponse = function buildCoordinatesResponse(/*coordinates*/) {
  //if (!coordinates || !coordinates.hasOwnProperty('lat') || !coordinates.hasOwnProperty('lon')) {
  //  return null;
  //}

  //TODO
  return new CoordinatesResponseBuilder()
    .withLat(12.344)
    .withLon(3.453)
    .build();
};

const buildCoordinatesDomain = function buildCoordinatesDomain(validate, coordinates) {
  if (!coordinates || !coordinates.hasOwnProperty('lat') || !coordinates.hasOwnProperty('lon')) {
    return null;
  }

  const lat = validate.getNumber(coordinates.lat, 'lat');
  const lon = validate.getNumber(coordinates.lon, 'lon');

  return new CoordinatesDomainBuilder()
    .withLat(lat)
    .withLon(lon)
    .build();
};

const buildMainImageResponse = function buildMainImageResponse(images) {

  if (!images || images.length < 1) {
    return null;
  }

  const image = images[0];

  return new MainImageResponseBuilder()
    .withSmall(image.url)
    .withMedium(images[0].url)
    .withLarge(images[0].url)
    .build();
};


const buildAuthorResponse = function buildAuthorResponse(authors) {
  if (!authors || authors.length < 1) {
    return [];
  }

  return authors.map(({name, organization}) => new AuthorResponseBuilder()
    .withName(name)
    .withOrganization(organization)
    .build());
};

const buildAuthorDomain = function buildAuthorDomain(authors) {
  if (!authors || authors.length < 1) {
    return [];
  }

  return authors.map(({name, organization}) => new AuthorDomainBuilder()
    .withName(name)
    .withOrganization(organization)
    .build());
};

const removeUndefined = function removeUndefined(obj) {

  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (obj[i] === undefined) {
        delete obj[i];
      }
      else if (typeof obj[i] === 'object') {
        removeUndefined(obj[i]);
      }
      else if (Array.isArray(obj[i])) {
        removeUndefined(obj[i]);
      }
    }
  }
};


module.exports = {
  buildDurationResponse: buildDurationResponse,
  buildDurationDomain: buildDurationDomain,
  buildImagesDomain: buildImagesDomain,
  buildOpeningTimesResponse: buildOpeningTimesResponse,
  buildOpeningTimesDomain: buildOpeningTimesDomain,
  buildMainImageResponse: buildMainImageResponse,
  buildCoordinatesResponse: buildCoordinatesResponse,
  buildCoordinatesDomain: buildCoordinatesDomain,
  buildAuthorResponse: buildAuthorResponse,
  buildAuthorDomain: buildAuthorDomain,
  removeUndefined: removeUndefined
};