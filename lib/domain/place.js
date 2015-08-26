var Place = function Place(id, parent, name, openingTimes, coordinates, festival, createdAt, updatedAt) {
  this.id = id;
  this.parent = parent;
  this.name = name;
  this.openingTimes = openingTimes;
  this.coordinates = coordinates;
  this.festival = festival;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
};

var PlaceBuilder = function PlaceBuilder() {
  this.id = null;
  this.parent = null;
  this.name = null;
  this.openingTimes = null;
  this.coordinates = null;
  this.festival = null;
  this.createdAt = null;
  this.updatedAt = null;

  var _this = this;

  this.withId = function (id) {
    _this.id = id;
    return _this;
  };

  this.withParent = function (parent) {
    _this.parent = parent;
    return _this;
  };

  this.withName = function (name) {
    _this.name = name;
    return _this;
  };

  this.withOpeningTimes = function (openingTimes) {
    _this.openingTimes = openingTimes;
    return _this;
  };

  this.withCoordinates = function (coordinates) {
    _this.coordinates = coordinates;
    return _this;
  };

  this.withFestival = function (festival) {
    _this.festival = festival;
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
    return new Place(
      _this.id,
      _this.parent,
      _this.name,
      _this.openingTimes,
      _this.coordinates,
      _this.festival,
      _this.createdAt,
      _this.updatedAt
    );
  };

};

module.exports = exports = {
  Place: Place,
  PlaceBuilder: PlaceBuilder
};