var chai = require('chai');
var should = chai.should();
var place = require('../../lib/domain/place');

describe('place domain test', function () {

  var id = 'id';
  var parent = 'parent';
  var name = 'name';
  var openingTimes = [{from: 'openingTimes'}];
  var coordinates = 'coordinates';
  var festival = 'festival';
  var createdAt = 'createdAt';
  var updatedAt = 'updatedAt';

  it('should create domain', function (done) {

    var placeDomain = new place.Place(
      id,
      parent,
      name,
      openingTimes,
      coordinates,
      festival,
      createdAt,
      updatedAt
    );

    should.exist(placeDomain);
    placeDomain.id.should.be.equal(id);
    placeDomain.parent.should.be.equal(parent);
    placeDomain.name.should.be.equal(name);
    placeDomain.openingTimes.should.be.equal(openingTimes);
    placeDomain.coordinates.should.be.equal(coordinates);
    placeDomain.festival.should.be.equal(festival);
    placeDomain.createdAt.should.be.equal(createdAt);
    placeDomain.updatedAt.should.be.equal(updatedAt);

    done();
  });

  it('should create domain by builder', function (done) {

    var placeDomain = new place.PlaceBuilder()
      .withId(id)
      .withParent(parent)
      .withName(name)
      .withOpeningTimes(openingTimes)
      .withCoordinates(coordinates)
      .withFestival(festival)
      .withCreatedAt(createdAt)
      .withUpdatedAt(updatedAt)
      .build();

    should.exist(placeDomain);
    placeDomain.id.should.be.equal(id);
    placeDomain.parent.should.be.equal(parent);
    placeDomain.name.should.be.equal(name);
    placeDomain.openingTimes.should.be.equal(openingTimes);
    placeDomain.coordinates.should.be.equal(coordinates);
    placeDomain.festival.should.be.equal(festival);
    placeDomain.createdAt.should.be.equal(createdAt);
    placeDomain.updatedAt.should.be.equal(updatedAt);

    done();
  });

});