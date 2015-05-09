var uuid = require('node-uuid');
var assert = require('assert-plus');
var moment = require('moment');

var validator = require('../../validator').validator;

var FestivalBuilder = require('../festival').FestivalBuilder;
var DurationBuilder = require('../duration').DurationBuilder;
var LocationBuilder = require('../location').LocationBuilder;
var ImageBuilder = require('../image').ImageBuilder;

var festivalsModel = require('festivals-model');
var FestivalBuilderResponse = festivalsModel.model.festival.FestivalBuilder;
var DurationBuilderResponse = festivalsModel.model.duration.DurationBuilder;
var LocationBuilderResponse = festivalsModel.model.location.LocationBuilder;
var ImageBuilderResponse = festivalsModel.model.image.ImageBuilder;
var CountryEnum = festivalsModel.model.countryEnum.CountryEnum;

var buildFestivalLocationResponse = function buildFestivalLocationResponse(data) {
  if (!data) {
    return null;
  }

  var openingTimes = [];
  for (var i in data.openingTimes) {
    var openingTime = buildDurationResponse(data.openingTimes[i]);

    if (openingTime) {
      openingTimes.push(openingTime);
    }
  }

  return new LocationBuilderResponse()
    .withName(data.name)
    .withState(data.state)
    .withCountry(data.country)
    .withStreet(data.street)
    .withZip(data.zip)
    .withOpeningTimes(openingTimes)
    .build();
};

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

var buildFestivalResponse = function buildFestivalResponse(data) {
  if (!data) {
    return null;
  }

  var duration = buildDurationResponse(data.duration);

  var mainImage = new ImageBuilderResponse()
    .withSmall(data.images[0].url)
    .withMedium(data.images[0].url)
    .withLarge(data.images[0].url)
    .build();

  var locations = [];
  if (data.locations) {
    for (var i in data.locations) {
      if (data.locations.hasOwnProperty(i)) {
        var location = buildFestivalLocationResponse(data.locations[i]);

        if (location) {
          locations.push(location);
        }
      }
    }
  }

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

var buildFestivalLocationDomain = function buildFestivalLocationDomain(validate, festivalId, location, index) {
  var locationIndex = 'location[' + index + ']';
  assert.object(location, locationIndex);
  var name = validate.getString(location.name, locationIndex + '.name');
  var state = validate.getString(location.state, locationIndex + '.state');
  var country = validate.getEnum(CountryEnum.getCountry(location.country), locationIndex + '.country');
  var street = validate.getString(location.street, locationIndex + '.street');
  var zip = validate.getString(location.zip, locationIndex + '.zip', null);

  assert.arrayOfObject(location.openingTimes, locationIndex + '.openingTimes');
  var openingTimes = [];
  for (var i in location.openingTimes) {
    var openingTime = buildDurationDomain(validate, location.openingTimes[i], locationIndex + '.openingTimes[' + i + ']');

    if (openingTime) {
      openingTimes.push(openingTime);
    }
  }

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
  var locations = [];
  for (var i in params.locations) {
    var location = buildFestivalLocationDomain(validate, id, params.locations[i], i);

    if (location) {
      locations.push(location);
    }
  }

  return locations;
};

var buildImagesDomain = function buildImagesDomain(validate, params) {
  if (!validate.require && !params.images) {
    return undefined;
  }

  assert.arrayOfObject(params.images, 'images');
  var images = [];
  for (var i in params.images) {
    var image = buildImageDomain(validate, params.images[i], 'images[' + i + ']');

    if (image) {
      images.push(image);
    }
  }

  return images;
};

var buildFestivalDomain = function buildFestivalDomain(params, newObject) {

  var id = undefined;
  var createdAt = undefined;
  var now = moment().toISOString();
  var validate = validator(newObject);

  var name = validate.getString(params.name, 'name');
  var description = validate.getString(params.description, 'description');
  var tags = validate.getArrayOfString(params.tags, 'tags', []);
  var locations = buildLocationsDomain(validate, id, params);
  var images = buildImagesDomain(validate, params);


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
    .withDuration(buildDurationDomain(validate, params.duration, 'duration'))
    .withLocations(locations)
    .build();

  removeUndefined(festival);
  return festival;
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
  buildFestivalResponse: buildFestivalResponse,
  buildFestivalDomain: buildFestivalDomain
};