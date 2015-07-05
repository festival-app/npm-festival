var chai = require('chai');
var should = chai.should();
var author = require('../../lib/domain/author');

describe('author domain test', function () {

  var name = 'name';
  var organization = 'organization';

  it('should create model', function (done) {

    var authorModel = new author.Author(
      name,
      organization
    );

    should.exist(authorModel);
    authorModel.name.should.be.equal(name);
    authorModel.organization.should.be.equal(organization);

    done();
  });

  it('should create model by builder', function (done) {

    var authorModel = new author.AuthorBuilder()
      .withName(name)
      .withOrganization(organization)
      .build();

    should.exist(authorModel);
    authorModel.name.should.be.equal(name);
    authorModel.organization.should.be.equal(organization);

    done();
  });

});