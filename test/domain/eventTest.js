var chai = require('chai');
var should = chai.should();
var event = require('../../lib/domain/event');

describe('event domain test', function () {

  var id = 'id';
  var name = 'name';
  var description = 'description';
  var tags = ['tags'];
  var mainImage = {small: 'mainImage'};
  var duration = {'duration': 111};
  var place = 'place';
  var category = 'category';
  var createdAt = 'createdAt';
  var updatedAt = 'updatedAt';
  var festival = 'festival';

  it('should create domain', function (done) {

    var eventModel = new event.Event(
      id,
      name,
      description,
      tags,
      mainImage,
      duration,
      place,
      category,
      createdAt,
      updatedAt,
      festival
    );

    should.exist(eventModel);
    eventModel.id.should.be.equal(id);
    eventModel.name.should.be.equal(name);
    eventModel.description.should.be.equal(description);
    eventModel.tags.should.be.equal(tags);
    eventModel.mainImage.should.be.equal(mainImage);
    eventModel.duration.should.be.equal(duration);
    eventModel.place.should.be.equal(place);
    eventModel.category.should.be.equal(category);
    eventModel.createdAt.should.be.equal(createdAt);
    eventModel.updatedAt.should.be.equal(updatedAt);
    eventModel.festival.should.be.equal(festival);

    done();
  });

  it('should create domain by builder', function (done) {

    var eventModel = new event.EventBuilder()
      .withId(id)
      .withName(name)
      .withDescription(description)
      .withTags(tags)
      .withMainImage(mainImage)
      .withDuration(duration)
      .withPlace(place)
      .withCategory(category)
      .withCreatedAt(createdAt)
      .withUpdatedAt(updatedAt)
      .withFestival(festival)
      .build();

    should.exist(eventModel);
    eventModel.id.should.be.equal(id);
    eventModel.name.should.be.equal(name);
    eventModel.description.should.be.equal(description);
    eventModel.tags.should.be.equal(tags);
    eventModel.mainImage.should.be.equal(mainImage);
    eventModel.duration.should.be.equal(duration);
    eventModel.place.should.be.equal(place);
    eventModel.category.should.be.equal(category);
    eventModel.createdAt.should.be.equal(createdAt);
    eventModel.updatedAt.should.be.equal(updatedAt);
    eventModel.festival.should.be.equal(festival);

    done();
  });

});