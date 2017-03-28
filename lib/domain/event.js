'use strict';

class Event {
  constructor(id, name, description, status, tags, authors, images, duration, place, category, createdAt, updatedAt, festival, metadata) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.tags = tags;
    this.authors = authors;
    this.images = images;
    this.duration = duration;
    this.place = place;
    this.category = category;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.festival = festival;
    this.metadata = metadata;
  }
}

class EventBuilder {
  constructor() {
    this.id = null;
    this.name = null;
    this.description = null;
    this.status = null;
    this.tags = null;
    this.authors = null;
    this.images = null;
    this.duration = null;
    this.place = null;
    this.category = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.festival = null;
    this.metadata = null;
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

  withTags(tags) {
    this.tags = tags;
    return this;
  };

  withAuthors(authors) {
    this.authors = authors;
    return this;
  };

  withImages(images) {
    this.images = images;
    return this;
  };

  withDuration(duration) {
    this.duration = duration;
    return this;
  };

  withPlace(place) {
    this.place = place;
    return this;
  };

  withCategory(category) {
    this.category = category;
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

  withFestival(festival) {
    this.festival = festival;
    return this;
  };

  withMetadata(metadata) {
    this.metadata = metadata;
    return this;
  };

  build() {
    return new Event(
      this.id,
      this.name,
      this.description,
      this.status,
      this.tags,
      this.authors,
      this.images,
      this.duration,
      this.place,
      this.category,
      this.createdAt,
      this.updatedAt,
      this.festival,
      this.metadata
    );
  }
}

module.exports = {
  Event: Event,
  EventBuilder: EventBuilder
};