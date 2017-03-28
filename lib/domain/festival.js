'use strict';

class Festival {
  constructor(id, name, description, type, status, tags, images, duration, locations, createdAt, updatedAt, userId) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.status = status;
    this.tags = tags;
    this.images = images;
    this.duration = duration;
    this.locations = locations;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.userId = userId;
  }
}

class FestivalBuilder {
  constructor() {
    this.id = null;
    this.name = null;
    this.description = null;
    this.type = null;
    this.status = null;
    this.tags = null;
    this.images = null;
    this.duration = null;
    this.locations = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.userId = null;
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

  withType(type) {
    this.type = type;
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

  withImages(images) {
    this.images = images;
    return this;
  };

  withDuration(duration) {
    this.duration = duration;
    return this;
  };

  withLocations(locations) {
    this.locations = locations;
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

  withUserId(userId) {
    this.userId = userId;
    return this;
  };

  build() {
    return new Festival(
      this.id,
      this.name,
      this.description,
      this.type,
      this.status,
      this.tags,
      this.images,
      this.duration,
      this.locations,
      this.createdAt,
      this.updatedAt,
      this.userId
    );
  }
}

module.exports = {
  Festival: Festival,
  FestivalBuilder: FestivalBuilder
};