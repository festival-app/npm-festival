var News = function News(id, name, description, status, images, authors, tags, festival, publishedAt, createdAt, updatedAt) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.status = status;
  this.images = images;
  this.authors = authors;
  this.tags = tags;
  this.festival = festival;
  this.publishedAt = publishedAt;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
};

var NewsBuilder = function NewsBuilder() {
  this.id = null;
  this.name = null;
  this.description = null;
  this.status = null;
  this.images = null;
  this.authors = null;
  this.tags = null;
  this.festival = null;
  this.publishedAt = null;
  this.createdAt = null;
  this.updatedAt = null;

  var self = this;

  this.withId = function withId(id) {
    self.id = id;
    return self;
  };

  this.withName = function withName(name) {
    self.name = name;
    return self;
  };

  this.withDescription = function withDescription(description) {
    self.description = description;
    return self;
  };

  this.withStatus = function withStatus(status) {
    self.status = status;
    return self;
  };

  this.withImages = function withImages(images) {
    self.images = images;
    return self;
  };

  this.withAuthors = function withAuthors(authors) {
    self.authors = authors;
    return self;
  };

  this.withTags = function withTags(tags) {
    self.tags = tags;
    return self;
  };

  this.withFestival = function (festival) {
    self.festival = festival;
    return self;
  };

  this.withPublishedAt = function withPublishedAt(publishedAt) {
    self.publishedAt = publishedAt;
    return self;
  };

  this.withCreatedAt = function withCreatedAt(createdAt) {
    self.createdAt = createdAt;
    return self;
  };

  this.withUpdatedAt = function withUpdatedAt(updatedAt) {
    self.updatedAt = updatedAt;
    return self;
  };


  this.build = function build() {
    return new News(
      self.id,
      self.name,
      self.description,
      self.status,
      self.images,
      self.authors,
      self.tags,
      self.festival,
      self.publishedAt,
      self.createdAt,
      self.updatedAt
    );
  };

};

module.exports = exports = {
  News: News,
  NewsBuilder: NewsBuilder
};
