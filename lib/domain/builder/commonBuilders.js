var assert = require('assert-plus');
var moment = require('moment');

var DurationBuilder = require('../duration').DurationBuilder;
var ImageBuilder = require('../image').ImageBuilder;

var festivalsModel = require('festivals-model');
var DurationBuilderResponse = festivalsModel.model.duration.DurationBuilder;
var ImageBuilderResponse = festivalsModel.model.image.ImageBuilder;

var buildDurationResponse = function buildDurationResponse(data) {

  var duration = null;

  var start = moment(data.startAt);
  var end = moment(data.finishAt);

  if (end && start) {
    var periodDuration = moment.duration(end.diff(start));
    var periodMs = periodDuration.asMilliseconds();

    duration = new DurationBuilderResponse()
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

  return new DurationBuilder()
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

  return new ImageBuilder()
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
  var images = [];
  for (var i in params.images) {
    if (params.images.hasOwnProperty(i)) {
      var image = buildImageDomain(validate, params.images[i], 'images[' + i + ']');

      if (image) {
        images.push(image);
      }
    }
  }

  return images;
};

var buildOpeningTimesResponse = function buildOpeningTimesResponse(openingTimes) {

  if (!openingTimes) {
    return null;
  }

  var openingTimes = [];
  for (var i in openingTimes) {
    var openingTime = buildDurationResponse(openingTimes[i]);

    if (openingTime) {
      openingTimes.push(openingTime);
    }
  }

  return openingTimes;
};

var buildMainImageResponse = function buildMainImageResponse(images) {

  if (!images) {
    return null;
  }

  return new ImageBuilderResponse()
    .withSmall(images[0].url)
    .withMedium(images[0].url)
    .withLarge(images[0].url)
    .build();
};

var removeUndefined = function removeUndefined(obj) {

  for (var i in obj) {
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
};


module.exports = {
  buildDurationResponse: buildDurationResponse,
  buildDurationDomain: buildDurationDomain,
  buildImagesDomain: buildImagesDomain,
  buildOpeningTimesResponse: buildOpeningTimesResponse,
  buildMainImageResponse: buildMainImageResponse,
  removeUndefined: removeUndefined
};