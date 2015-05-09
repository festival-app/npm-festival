var Event = function Event(id, name, description, tags, mainImage, duration, place, category, createdAt, updatedAt, festival) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.tags = tags;
  this.mainImage = mainImage;
  this.duration = duration;
  this.place = place;
  this.category = category;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
  this.festival = festival;
};

var EventBuilder = function EventBuilder() {
  this.id = null;
  this.name = null;
  this.description = null;
  this.tags = null;
  this.mainImage = null;
  this.duration = null;
  this.place = null;
  this.category = null;
  this.createdAt = null;
  this.updatedAt = null;
  this.festival = null;

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

  this.withMainImage = function (mainImage) {
    self.mainImage = mainImage;
    return self;
  };

  this.withDuration = function (duration) {
    self.duration = duration;
    return self;
  };

  this.withPlace = function (place) {
    self.place = place;
    return self;
  };

  this.withCategory = function (category) {
    self.category = category;
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

  this.withFestival = function (festival) {
    self.festival = festival;
    return self;
  };

  this.build = function () {
    return new Event(
      self.id,
      self.name,
      self.description,
      self.tags,
      self.mainImage,
      self.duration,
      self.place,
      self.category,
      self.createdAt,
      self.updatedAt,
      self.festival
    );
  };

};

module.exports = exports = {
  Event: Event,
  EventBuilder: EventBuilder
};