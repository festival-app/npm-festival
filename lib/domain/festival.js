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

  this.withImages = function (images) {
    _this.images = images;
    return _this;
  };

  this.withDuration = function (duration) {
    _this.duration = duration;
    return _this;
  };

  this.withLocations = function (locations) {
    _this.locations = locations;
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


  this.build = function () {
    return new Festival(
      _this.id,
      _this.name,
      _this.description,
      _this.tags,
      _this.images,
      _this.duration,
      _this.locations,
      _this.createdAt,
      _this.updatedAt
    );
  };

};

module.exports = exports = {
  Festival: Festival,
  FestivalBuilder: FestivalBuilder
};