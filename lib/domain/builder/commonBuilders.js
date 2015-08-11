var assert = require('assert-plus');
var moment = require('moment');

var DurationDomainBuilder = require('../duration').DurationBuilder;
var ImageDomainBuilder = require('../image').ImageBuilder;
var CoordinatesDomainBuilder = require('../coordinates').CoordinatesBuilder;
var AuthorDomainBuilder = require('../author').AuthorBuilder;

var festivalsModel = require('festivals-model');
var DurationResponseBuilder = festivalsModel.model.durationResponse.DurationResponseBuilder;
var MainImageResponseBuilder = festivalsModel.model.mainImageResponse.MainImageResponseBuilder;
var CoordinatesResponseBuilder = festivalsModel.model.coordinatesResponse.CoordinatesResponseBuilder;
var AuthorResponseBuilder = festivalsModel.model.authorResponse.AuthorResponseBuilder;

var buildDurationResponse = function buildDurationResponse(data) {

  var duration = null;

  var start = moment(data.startAt);
  var end = moment(data.finishAt);

  if (end && start) {
    var periodDuration = moment.duration(end.diff(start));
    var periodMs = periodDuration.asMilliseconds();

    duration = new DurationResponseBuilder()
      .withStartAt(start.toISOString())
      .withFinishAt(end.toISOString())
      .withPeriodMs(periodMs)
      .build();
  }

  return duration;
};

var buildDurationDomain = function buildDurationDomain(validate, duration, prefix) {
  if (!validate.require && !duration) {
    return undefined;
  }

  assert.object(duration, prefix);

  var durationStartAt = validate.getDate(duration.startAt, prefix + '.startAt');
  var durationFinishAt = validate.getDate(duration.finishAt, prefix + '.finishAt');

  return new DurationDomainBuilder()
    .withStartAt(durationStartAt.toISOString())
    .withFinishAt(durationFinishAt.toISOString())
    .build();
};

var buildImageDomain = function buildImageDomain(validate, image, prefix) {
  assert.object(image, prefix);

  var url = validate.getString(image.url, prefix + '.url', null);
  var content = validate.getString(image.content, prefix + '.content', null);
  var order = validate.getNumber(image.order, prefix + '.order', 0);

  if (!url && !content) {
    assert.ok(null, 'one of url (string) or content (string) is required');
  }

  return new ImageDomainBuilder()
    .withUrl(url)
    .withContent(content)
    .withOrder(order)
    .build();
};

var buildImagesDomain = function buildImagesDomain(validate, params) {
  if (!validate.require && !params.images) {
    return undefined;
  }

  assert.arrayOfObject(params.images, 'images');

  return params.images.map(function (image) {
    return buildImageDomain(validate, image, 'images[]');
  });
};

var buildOpeningTimesResponse = function buildOpeningTimesResponse(openingTimes) {

  if (!openingTimes || openingTimes.length < 1) {
    return [];
  }

  return openingTimes.map(function (opening) {
    return buildDurationResponse(opening);
  });

};

var buildOpeningTimesDomain = function buildOpeningTimesDomain(validate, openingTimes) {

  if (!openingTimes || openingTimes.length < 1) {
    return [];
  }

  return openingTimes.map(function (opening) {
    return buildDurationDomain(validate, opening, '');
  });

};

var buildCoordinatesResponse = function buildCoordinatesResponse(coordinates) {
  //if (!coordinates || !coordinates.hasOwnProperty('lat') || !coordinates.hasOwnProperty('lon')) {
  //  return null;
  //}

  //TODO
  return new CoordinatesResponseBuilder()
    .withLat(12.344)
    .withLon(3.453)
    .build();
};

var buildCoordinatesDomain = function buildCoordinatesDomain(validate, coordinates) {
  if (!coordinates || !coordinates.hasOwnProperty('lat') || !coordinates.hasOwnProperty('lon')) {
    return null;
  }

  var lat = validate.getNumber(coordinates.lat, 'lat');
  var lon = validate.getNumber(coordinates.lon, 'lon');

  return new CoordinatesDomainBuilder()
    .withLat(lat)
    .withLon(lon)
    .build();
};

var buildMainImageResponse = function buildMainImageResponse(images) {

  if (!images || images.length < 1) {
    return null;
  }

  var image = images[0];

  return new MainImageResponseBuilder()
    .withSmall(image.url)
    .withMedium(images[0].url)
    .withLarge(images[0].url)
    .build();
};


var buildAuthorResponse = function buildAuthorResponse(authors) {
  if (!authors || authors.length < 1) {
    return [];
  }

  return authors.map(function (author) {
    return new AuthorResponseBuilder()
      .withName(author.name)
      .withOrganization(author.organization)
      .build();
  });
};

var buildAuthorDomain = function buildAuthorDomain(authors) {
  if (!authors || authors.length < 1) {
    return [];
  }

  return authors.map(function (author) {
    return new AuthorDomainBuilder()
      .withName(author.name)
      .withOrganization(author.organization)
      .build();
  });
};

var removeUndefined = function removeUndefined(obj) {

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (obj[i] === undefined) {
        delete obj[i];
      }
      if (typeof obj[i] === 'object') {
        removeUndefined(obj[i]);
      }
      if (typeof obj[i] === 'array') {
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