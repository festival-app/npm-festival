'use strict';

class Coordinates {
  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  };
}

class CoordinatesBuilder {
  constructor() {
    this.lat = null;
    this.lon = null;
  }

  withLat(lat) {
    this.lat = lat;
    return this;
  };

  withLon(lon) {
    this.lon = lon;
    return this;
  };

  build() {
    return new Coordinates(
      this.lat,
      this.lon
    );
  };
}

module.exports = {
  Coordinates: Coordinates,
  CoordinatesBuilder: CoordinatesBuilder
};
