'use strict';

class Place {
  constructor(id, parent, name, openingTimes, coordinates, festival, createdAt, updatedAt) {
    this.id = id;
    this.parent = parent;
    this.name = name;
    this.openingTimes = openingTimes;
    this.coordinates = coordinates;
    this.festival = festival;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

class PlaceBuilder {
  constructor() {
    this.id = null;
    this.parent = null;
    this.name = null;
    this.openingTimes = null;
    this.coordinates = null;
    this.festival = null;
    this.createdAt = null;
    this.updatedAt = null;
  }

  withId(id) {
    this.id = id;
    return this;
  };

  withParent(parent) {
    this.parent = parent;
    return this;
  };

  withName(name) {
    this.name = name;
    return this;
  };

  withOpeningTimes(openingTimes) {
    this.openingTimes = openingTimes;
    return this;
  };

  withCoordinates(coordinates) {
    this.coordinates = coordinates;
    return this;
  };

  withFestival(festival) {
    this.festival = festival;
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
    return new Place(
      this.id,
      this.parent,
      this.name,
      this.openingTimes,
      this.coordinates,
      this.festival,
      this.createdAt,
      this.updatedAt
    );
  }
}

module.exports = {
  Place: Place,
  PlaceBuilder: PlaceBuilder
};
