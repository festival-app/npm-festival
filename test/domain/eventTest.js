var chai = require('chai');
var should = chai.should();
var event = require('../../lib/domain/event');

describe('event domain test', function () {

  var id = 'id';
  var name = 'name';
  var description = 'description';
  var tags = ['tags'];
  var authors = ['authors'];
  var images = [{small: 'images'}];
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
      authors,
      images,
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
    eventModel.authors.should.be.equal(authors);
    eventModel.images.should.be.equal(images);
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
      .withAuthors(authors)
      .withImages(images)
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
    eventModel.authors.should.be.equal(authors);
    eventModel.images.should.be.equal(images);
    eventModel.duration.should.be.equal(duration);
    eventModel.place.should.be.equal(place);
    eventModel.category.should.be.equal(category);
    eventModel.createdAt.should.be.equal(createdAt);
    eventModel.updatedAt.should.be.equal(updatedAt);
    eventModel.festival.should.be.equal(festival);

    done();
  });

});