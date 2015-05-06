var uuid = require('node-uuid');
var moment = require('moment');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var elasticsearchProvider = require('../../lib/provider/elasticsearch');

var festivalsModel = require('festivals-model');

var FestivalBuilder = festivalsModel.model.festival.FestivalBuilder;
var DurationBuilder = festivalsModel.model.duration.DurationBuilder;
var LocationBuilder = festivalsModel.model.location.LocationBuilder;
var ImageBuilder = festivalsModel.model.image.ImageBuilder;
var PlaceBuilder = festivalsModel.model.place.PlaceBuilder;
var EventBuilder = festivalsModel.model.event.EventBuilder;
var SearchFestivalEventsRequestBuilder = festivalsModel.model.searchFestivalEventsRequest.SearchFestivalEventsRequestBuilder;
var SearchFestivalsRequestBuilder = festivalsModel.model.searchFestivalsRequest.SearchFestivalsRequestBuilder;

describe('elastic search provider test', function () {

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
      .withPeriodMs(28000)
      .build();

    var location = new LocationBuilder()
      .withName('location-name')
      .withState('location-state')
      .withCountry('PL')
      .withStreet('location-street')
      .withZip('location-zip')
      .withOpeningTimes([])
      .build();

    var mainImage = new ImageBuilder()
      .withSmall('http://small')
      .withMedium('http://medium')
      .withLarge('http://large')
      .build();

    var locations = [location];
    var newFestival = new FestivalBuilder()
      .withId(festivalId)
      .withName(name)
      .withDescription(description)
      .withTags(tags)
      .withMainImage(mainImage)
      .withCreatedAt(createdAt)
      .withUpdatedAt(createdAt)
      .withDuration(duration)
      .withLocations(locations)
      .build();

    elasticsearchProvider.createFestival(newFestival, function (err, festival) {
      should.not.exist(err);
      should.exist(festival);

      festival.id.should.be.equal(festivalId);
      festival.name.should.be.equal(name);
      festival.description.should.be.equal(description);
      festival.tags.should.be.equal(tags);
      festival.mainImage.should.be.equal(mainImage);
      festival.createdAt.should.be.equal(createdAt);
      festival.updatedAt.should.be.equal(createdAt);
      festival.duration.should.be.equal(duration);
      festival.locations.should.be.equal(locations);

      done();
    });
  });

  it('should get festival', function (done) {

    elasticsearchProvider.getFestival(festivalId, function (err, festival) {
      should.not.exist(err);
      should.exist(festival);

      festival.id.should.be.equal(festivalId);
      should.exist(festival.name);
      should.exist(festival.description);
      should.exist(festival.tags);
      should.exist(festival.mainImage);
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

    elasticsearchProvider.getFestivals(searchFestivalsRequest, function (err, events) {
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
    var description = 'description-' + placeId;

    var duration = new DurationBuilder()
      .withStartAt(createdAt)
      .withFinishAt(finishAt)
      .withPeriodMs(28000)
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

    elasticsearchProvider.createFestivalPlace(festivalId, newPlace, function (err, place) {
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
      .withPeriodMs(12000)
      .build();

    var mainImage = new ImageBuilder()
      .withSmall('http://small')
      .withMedium('http://medium')
      .withLarge('http://large')
      .build();

    var newEvent = new EventBuilder()
      .withId(eventId)
      .withName(name)
      .withDescription(description)
      .withTags(tags)
      .withMainImage(mainImage)
      .withDuration(duration)
      .withPlace(placeId)
      .withCategory(category)
      .withCreatedAt(createdAt)
      .withUpdatedAt(createdAt)
      .build();

    elasticsearchProvider.createFestivalEvent(festivalId, newEvent, function (err, event) {
      should.not.exist(err);
      should.exist(event);

      event.id.should.be.equal(eventId);
      event.name.should.be.equal(name);
      event.description.should.be.equal(description);
      event.tags.should.be.equal(tags);
      event.mainImage.should.be.equal(mainImage);
      event.duration.should.be.equal(duration);
      event.place.should.be.equal(placeId);
      event.category.should.be.equal(category);
      event.createdAt.should.be.equal(createdAt);
      event.updatedAt.should.be.equal(createdAt);

      done();
    });
  });

  it('should get festival event', function (done) {

    elasticsearchProvider.getFestivalEvent(festivalId, eventId, function (err, event) {
      should.not.exist(err);
      should.exist(event);

      event.id.should.be.equal(eventId);
      should.exist(event.name);
      should.exist(event.description);
      should.exist(event.tags);
      should.exist(event.mainImage);
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

    elasticsearchProvider.getFestivalEvents(festivalId, searchFestivalEventsRequest, function (err, events) {
      should.not.exist(err);
      should.exist(events);
      should.exist(events.total);
      should.exist(events.events);

      done();
    });
  });

});