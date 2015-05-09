var Festival = function Festival(id, name, description, tags, images, duration, locations, createdAt, updatedAt) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.tags = tags;
  this.images = images;
  this.duration = duration;
  this.locations = locations;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
};

var FestivalBuilder = function FestivalBuilder() {
  this.id = null;
  this.name = null;
  this.description = null;
  this.tags = null;
  this.images = null;
  this.duration = null;
  this.locations = null;
  this.createdAt = null;
  this.updatedAt = null;

  var self = this;

  this.withId = function (id) {
    self.id = id;
    return self;
  };

  this.withName = function (name) {
    self.name = name;
    return self;
  };

  this.withDescription = function (description) {
    self.description = description;
    return self;
  };

  this.withTags = function (tags) {
    self.tags = tags;
    return self;
  };

  this.withImages = function (images) {
    self.images = images;
    return self;
  };

  this.withDuration = function (duration) {
    self.duration = duration;
    return self;
  };

  this.withLocations = function (locations) {
    self.locations = locations;
    return self;
  };

  this.withCreatedAt = function (createdAt) {
    self.createdAt = createdAt;
    return self;
  };

  this.withUpdatedAt = function (updatedAt) {
    self.updatedAt = updatedAt;
    return self;
  };


  this.build = function () {
    return new Festival(
      self.id,
      self.name,
      self.description,
      self.tags,
      self.images,
      self.duration,
      self.locations,
      self.createdAt,
      self.updatedAt
    );
  };

};

module.exports = exports = {
  Festival: Festival,
  FestivalBuilder: FestivalBuilder
};