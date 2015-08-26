var config = require('config');
var uuid = require('node-uuid');
var moment = require('moment');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var Firebase = require('firebase');
var client = new Firebase(config.provider.firebase.url);
var firebaseProvider = require('../../lib/provider/fireabaseProvider').provider(client);

var FestivalBuilder = require('../../lib/domain/festival').FestivalBuilder;
var DurationBuilder = require('../../lib/domain/duration').DurationBuilder;
var LocationBuilder = require('../../lib/domain/location').LocationBuilder;
var ImageBuilder = require('../../lib/domain/image').ImageBuilder;
var PlaceBuilder = require('../../lib/domain/place').PlaceBuilder;
var EventBuilder = require('../../lib/domain/event').EventBuilder;

var festivalsModel = require('festivals-model');
var SearchFestivalEventsRequestBuilder = festivalsModel.model.searchFestivalEventsRequest.SearchFestivalEventsRequestBuilder;
var SearchFestivalsRequestBuilder = festivalsModel.model.searchFestivalsRequest.SearchFestivalsRequestBuilder;

describe('firebase provider test', function () {

  var festivalId = null;
  var placeId = null;
  var eventId = null;
  var createdAt = moment().toISOString();
  var finishAt = moment().add(2, 'days').toISOString();

  it('should create festival', function (done) {

    festivalId = uuid.v4();
    var name = 'name-' + festivalId;
    var description = 'description-' + festivalId;
    var tags = ['fantasy'];

    var duration = new DurationBuilder()
      .withStartAt(createdAt)
      .withFinishAt(finishAt)
      .build();

    var location = new LocationBuilder()
      .withName('location-name')
      .withState('location-state')
      .withCountry('PL')
      .withStreet('location-street')
      .withZip('location-zip')
      .withOpeningTimes([])
      .withFestival(festivalId)
      .build();

    var images = [
      new ImageBuilder()
        .withUrl('http://podgk.pl/wp-content/uploads/2011/06/dni_fantastyki_podgk.jpg')
        .withContent(null)
        .withOrder(0)
        .build()
    ];

    var locations = [location];
    var newFestival = new FestivalBuilder()
      .withId(festivalId)
      .withName(name)
      .withDescription(description)
      .withTags(tags)
      .withImages(images)
      .withCreatedAt(createdAt)
      .withUpdatedAt(createdAt)
      .withDuration(duration)
      .withLocations(locations)
      .build();

    firebaseProvider.createFestival(newFestival, function (err, festival) {
      should.not.exist(err);
      should.exist(festival);

      festival.id.should.be.equal(festivalId);
      festival.name.should.be.equal(name);
      festival.description.should.be.equal(description);
      festival.tags.should.be.equal(tags);
      festival.images.should.be.equal(images);
      festival.createdAt.should.be.equal(createdAt);
      festival.updatedAt.should.be.equal(createdAt);
      festival.duration.should.be.equal(duration);
      festival.locations.should.be.equal(locations);

      done();
    });
  });

  it('should get festival', function (done) {

    firebaseProvider.getFestival(festivalId, function (err, festival) {
      should.not.exist(err);
      should.exist(festival);

      festival.id.should.be.equal(festivalId);
      should.exist(festival.name);
      should.exist(festival.description);
      should.exist(festival.tags);
      should.exist(festival.images);
      festival.createdAt.should.be.equal(createdAt);
      festival.updatedAt.should.be.equal(createdAt);
      should.exist(festival.duration);
      should.exist(festival.locations);

      done();
    });
  });


  it('should get festivals collection', function (done) {

    var searchFestivalsRequest = new SearchFestivalsRequestBuilder()
      //.withName(name)
      //.withCountry(country)
      //.withStartAt(startAt)
      //.withLimit(limit)
      //.withOffset(offset)
      .build();

    firebaseProvider.getFestivals(searchFestivalsRequest, function (err, events) {
      should.not.exist(err);
      should.exist(events);
      should.exist(events.total);
      should.exist(events.festivals);

      done();
    });
  });

  it('should create festival place', function (done) {

    placeId = uuid.v4();
    var name = 'name-' + placeId;

    var duration = new DurationBuilder()
      .withStartAt(createdAt)
      .withFinishAt(finishAt)
      .build();

    var openingTimes = [
      duration
    ];

    var newPlace = new PlaceBuilder()
      .withId(placeId)
      .withParent(null)
      .withName(name)
      .withOpeningTimes(openingTimes)
      .build();

    firebaseProvider.createFestivalPlace(festivalId, newPlace, function (err, place) {
      should.not.exist(err);
      should.exist(place);

      place.id.should.be.equal(placeId);
      place.name.should.be.equal(name);
      place.openingTimes.should.be.equal(openingTimes);

      done();
    });
  });

  it('should create festival event', function (done) {

    eventId = uuid.v4();
    var name = 'name-' + eventId;
    var description = 'description-' + eventId;
    var tags = ['fantasy'];
    var category = 'category';
    var finishAt = moment().add(2, 'hours').toISOString();

    var duration = new DurationBuilder()
      .withStartAt(createdAt)
      .withFinishAt(finishAt)
      .build();

    var newEvent = new EventBuilder()
      .withId(eventId)
      .withName(name)
      .withDescription(description)
      .withTags(tags)
      .withDuration(duration)
      .withPlace(placeId)
      .withCategory(category)
      .withCreatedAt(createdAt)
      .withUpdatedAt(createdAt)
      .build();

    firebaseProvider.createFestivalEvent(festivalId, newEvent, function (err, event) {
      should.not.exist(err);
      should.exist(event);

      event.id.should.be.equal(eventId);
      event.name.should.be.equal(name);
      event.description.should.be.equal(description);
      event.tags.should.be.equal(tags);
      //event.images.should.be.equal(images);
      event.duration.should.be.equal(duration);
      event.place.should.be.equal(placeId);
      event.category.should.be.equal(category);
      event.createdAt.should.be.equal(createdAt);
      event.updatedAt.should.be.equal(createdAt);

      done();
    });
  });

  it('should get festival event', function (done) {

    firebaseProvider.getFestivalEvent(festivalId, eventId, function (err, event) {
      should.not.exist(err);
      should.exist(event);

      event.id.should.be.equal(eventId);
      should.exist(event.name);
      should.exist(event.description);
      should.exist(event.tags);
      //should.exist(event.images);
      should.exist(event.duration);
      should.exist(event.place);
      should.exist(event.category);
      event.createdAt.should.be.equal(createdAt);
      event.updatedAt.should.be.equal(createdAt);

      done();
    });
  });

  it('should get festival events collection', function (done) {

    var searchFestivalEventsRequest = new SearchFestivalEventsRequestBuilder()
      //.withName(name)
      //.withPlace(place)
      //.withStartAt(startAt)
      //.withFinishAt(finishAt)
      //.withCategory(category)
      //.withLimit(limit)
      //.withOffset(offset)
      .build();

    firebaseProvider.getFestivalEvents(festivalId, searchFestivalEventsRequest, function (err, events) {
      should.not.exist(err);
      should.exist(events);
      should.exist(events.total);
      should.exist(events.events);

      done();
    });
  });

});