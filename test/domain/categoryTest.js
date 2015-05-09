var chai = require('chai');
var should = chai.should();
var category = require('../../lib/domain/category');

describe('category domain test', function () {

  var id = 'id';
  var parent = 'parent';
  var name = 'name';
  var festival = 'festival';

  it('should create domain', function (done) {

    var categoryDomain = new category.Category(
      id,
      parent,
      name,
      festival
    );

    should.exist(categoryDomain);
    categoryDomain.id.should.be.equal(id);
    categoryDomain.parent.should.be.equal(parent);
    categoryDomain.name.should.be.equal(name);
    categoryDomain.festival.should.be.equal(festival);

    done();
  });

  it('should create domain by builder', function (done) {

    var categoryDomain = new category.CategoryBuilder()
      .withId(id)
      .withParent(parent)
      .withName(name)
      .withFestival(festival)
      .build();

    should.exist(categoryDomain);
    categoryDomain.id.should.be.equal(id);
    categoryDomain.parent.should.be.equal(parent);
    categoryDomain.name.should.be.equal(name);
    categoryDomain.festival.should.be.equal(festival);

    done();
  });

});