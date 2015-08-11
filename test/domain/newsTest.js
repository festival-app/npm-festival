var chai = require('chai');
var should = chai.should();
var news = require('../../lib/domain/news');

describe('news domain test', function () {

  var id = 'id';
  var name = 'name';
  var description = 'description';
  var images = 'images';
  var authors = 'authors';
  var tags = 'tags';
  var festival = 'festival';
  var createdAt = 'createdAt';
  var updatedAt = 'updatedAt';

  it('should create model', function (done) {

    var newsModel = new news.News(
      id, 
      name, 
      description, 
      images, 
      authors, 
      tags,
      festival,
      createdAt,
      updatedAt
    );

    should.exist(newsModel);
    newsModel.id.should.be.equal(id);
    newsModel.name.should.be.equal(name);
    newsModel.description.should.be.equal(description);
    newsModel.images.should.be.equal(images);
    newsModel.authors.should.be.equal(authors);
    newsModel.tags.should.be.equal(tags);
    newsModel.festival.should.be.equal(festival);
    newsModel.createdAt.should.be.equal(createdAt);
    newsModel.updatedAt.should.be.equal(updatedAt);
    done();
  });

  it('should create domain by builder', function (done) {

    var newsModel = new news.NewsBuilder()
      .withId(id)
      .withName(name)
      .withDescription(description)
      .withImages(images)
      .withAuthors(authors)
      .withTags(tags)
      .withFestival(festival)
      .withCreatedAt(createdAt)
      .withUpdatedAt(updatedAt)
      .build();

    should.exist(newsModel);
    newsModel.id.should.be.equal(id);
    newsModel.name.should.be.equal(name);
    newsModel.description.should.be.equal(description);
    newsModel.images.should.be.equal(images);
    newsModel.authors.should.be.equal(authors);
    newsModel.tags.should.be.equal(tags);
    newsModel.festival.should.be.equal(festival);
    newsModel.createdAt.should.be.equal(createdAt);
    newsModel.updatedAt.should.be.equal(updatedAt);
    done();
  });

});
