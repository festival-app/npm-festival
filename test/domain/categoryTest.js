var chai = require('chai');
var should = chai.should();
var category = require('../../lib/domain/category');

describe('category domain test', function () {

  var id = 'id';
  var parent = 'parent';
  var name = 'name';
  var festival = 'festival';
  var createdAt = 'createdAt';
  var updatedAt = 'updatedAt';

  it('should create domain', function (done) {

    var categoryDomain = new category.Category(
      id,
      parent,
      name,
      festival,
      createdAt,
      updatedAt
    );

    should.exist(categoryDomain);
    categoryDomain.id.should.be.equal(id);
    categoryDomain.parent.should.be.equal(parent);
    categoryDomain.name.should.be.equal(name);
    categoryDomain.festival.should.be.equal(festival);
    categoryDomain.createdAt.should.be.equal(createdAt);
    categoryDomain.updatedAt.should.be.equal(updatedAt);

    done();
  });

  it('should create domain by builder', function (done) {

    var categoryDomain = new category.CategoryBuilder()
      .withId(id)
      .withParent(parent)
      .withName(name)
      .withFestival(festival)
      .withCreatedAt(createdAt)
      .withUpdatedAt(updatedAt)
      .build();

    should.exist(categoryDomain);
    categoryDomain.id.should.be.equal(id);
    categoryDomain.parent.should.be.equal(parent);
    categoryDomain.name.should.be.equal(name);
    categoryDomain.festival.should.be.equal(festival);
    categoryDomain.createdAt.should.be.equal(createdAt);
    categoryDomain.updatedAt.should.be.equal(updatedAt);

    done();
  });

});