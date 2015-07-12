var Event = function Event(id, name, description, tags, authors, images, duration, place, category, createdAt, updatedAt, festival, metadata) {
  this.id = id;
  this.name = name;
  this.description = description;
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
};

var EventBuilder = function EventBuilder() {
  this.id = null;
  this.name = null;
  this.description = null;
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

  var _this = this;

  this.withId = function (id) {
    _this.id = id;
    return _this;
  };

  this.withName = function (name) {
    _this.name = name;
    return _this;
  };

  this.withDescription = function (description) {
    _this.description = description;
    return _this;
  };

  this.withTags = function (tags) {
    _this.tags = tags;
    return _this;
  };

  this.withAuthors = function (authors) {
    _this.authors = authors;
    return _this;
  };

  this.withImages = function (images) {
    _this.images = images;
    return _this;
  };

  this.withDuration = function (duration) {
    _this.duration = duration;
    return _this;
  };

  this.withPlace = function (place) {
    _this.place = place;
    return _this;
  };

  this.withCategory = function (category) {
    _this.category = category;
    return _this;
  };

  this.withCreatedAt = function (createdAt) {
    _this.createdAt = createdAt;
    return _this;
  };

  this.withUpdatedAt = function (updatedAt) {
    _this.updatedAt = updatedAt;
    return _this;
  };

  this.withFestival = function (festival) {
    _this.festival = festival;
    return _this;
  };

  this.withMetadata = function (metadata) {
    _this.metadata = metadata;
    return _this;
  };

  this.build = function () {
    return new Event(
      _this.id,
      _this.name,
      _this.description,
      _this.tags,
      _this.authors,
      _this.images,
      _this.duration,
      _this.place,
      _this.category,
      _this.createdAt,
      _this.updatedAt,
      _this.festival,
      _this.metadata
    );
  };

};

module.exports = exports = {
  Event: Event,
  EventBuilder: EventBuilder
};