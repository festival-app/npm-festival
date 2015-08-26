var chai = require('chai');
var should = chai.should();
var news = require('../../lib/domain/news');

describe('news domain test', function () {

  var id = 'id';
  var name = 'name';
  var description = 'description';
  var status = 'status';
  var images = 'images';
  var authors = 'authors';
  var tags = 'tags';
  var festival = 'festival';
  var publishedAt = 'publishedAt';
  var createdAt = 'createdAt';
  var updatedAt = 'updatedAt';

  it('should create model', function (done) {

    var newsModel = new news.News(
      id, 
      name, 
      description,
      status,
      images, 
      authors, 
      tags,
      festival,
      publishedAt,
      createdAt,
      updatedAt
    );

    should.exist(newsModel);
    newsModel.id.should.be.equal(id);
    newsModel.name.should.be.equal(name);
    newsModel.description.should.be.equal(description);
    newsModel.status.should.be.equal(status);
    newsModel.images.should.be.equal(images);
    newsModel.authors.should.be.equal(authors);
    newsModel.tags.should.be.equal(tags);
    newsModel.festival.should.be.equal(festival);
    newsModel.publishedAt.should.be.equal(publishedAt);
    newsModel.createdAt.should.be.equal(createdAt);
    newsModel.updatedAt.should.be.equal(updatedAt);
    done();
  });

  it('should create domain by builder', function (done) {

    var newsModel = new news.NewsBuilder()
      .withId(id)
      .withName(name)
      .withDescription(description)
      .withStatus(status)
      .withImages(images)
      .withAuthors(authors)
      .withTags(tags)
      .withFestival(festival)
      .withPublishedAt(publishedAt)
      .withCreatedAt(createdAt)
      .withUpdatedAt(updatedAt)
      .build();

    should.exist(newsModel);
    newsModel.id.should.be.equal(id);
    newsModel.name.should.be.equal(name);
    newsModel.description.should.be.equal(description);
    newsModel.status.should.be.equal(status);
    newsModel.images.should.be.equal(images);
    newsModel.authors.should.be.equal(authors);
    newsModel.tags.should.be.equal(tags);
    newsModel.festival.should.be.equal(festival);
    newsModel.publishedAt.should.be.equal(publishedAt);
    newsModel.createdAt.should.be.equal(createdAt);
    newsModel.updatedAt.should.be.equal(updatedAt);
    done();
  });

});
