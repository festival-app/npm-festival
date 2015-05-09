var Place = function Place(id, parent, name, openingTimes, festival, createdAt, updatedAt) {
  this.id = id;
  this.parent = parent;
  this.name = name;
  this.openingTimes = openingTimes;
  this.festival = festival;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
};

var PlaceBuilder = function PlaceBuilder() {
  this.id = null;
  this.parent = null;
  this.name = null;
  this.openingTimes = null;
  this.festival = null;
  this.createdAt = null;
  this.updatedAt = null;

  var self = this;

  this.withId = function (id) {
    self.id = id;
    return self;
  };

  this.withParent = function (parent) {
    self.parent = parent;
    return self;
  };

  this.withName = function (name) {
    self.name = name;
    return self;
  };

  this.withOpeningTimes = function (openingTimes) {
    self.openingTimes = openingTimes;
    return self;
  };

  this.withFestival = function (festival) {
    self.festival = festival;
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
    return new Place(
      self.id,
      self.parent,
      self.name,
      self.openingTimes,
      self.festival,
      self.createdAt,
      self.updatedAt
    );
  };

};

module.exports = exports = {
  Place: Place,
  PlaceBuilder: PlaceBuilder
};