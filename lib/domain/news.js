'use strict';

class News {
  constructor(id, name, description, status, images, authors, tags, festival, publishedAt, createdAt, updatedAt) {
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
  }
}

class NewsBuilder {
  constructor() {
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
  }

  withId(id) {
    this.id = id;
    return this;
  };

  withName(name) {
    this.name = name;
    return this;
  };

  withDescription(description) {
    this.description = description;
    return this;
  };

  withStatus(status) {
    this.status = status;
    return this;
  };

  withImages(images) {
    this.images = images;
    return this;
  };

  withAuthors(authors) {
    this.authors = authors;
    return this;
  };

  withTags(tags) {
    this.tags = tags;
    return this;
  };

  withFestival(festival) {
    this.festival = festival;
    return this;
  };

  withPublishedAt(publishedAt) {
    this.publishedAt = publishedAt;
    return this;
  };

  withCreatedAt(createdAt) {
    this.createdAt = createdAt;
    return this;
  };

  withUpdatedAt(updatedAt) {
    this.updatedAt = updatedAt;
    return this;
  };

  build() {
    return new News(
      this.id,
      this.name,
      this.description,
      this.status,
      this.images,
      this.authors,
      this.tags,
      this.festival,
      this.publishedAt,
      this.createdAt,
      this.updatedAt
    );
  };
}

module.exports = {
  News: News,
  NewsBuilder: NewsBuilder
};
