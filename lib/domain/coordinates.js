'use strict';

var Coordinates = function Coordinates(lat, lon) {
  this.lat = lat;
  this.lon = lon;
};

var CoordinatesBuilder = function CoordinatesBuilder() {
  this.lat = null;
  this.lon = null;

  var self = this;

  this.withLat = function withLat(lat) {
    self.lat = lat;
    return self;
  };

  this.withLon = function withLon(lon) {
    self.lon = lon;
    return self;
  };


  this.build = function build() {
    return new Coordinates(
     self.lat, 
     self.lon
    );
  };

};

module.exports = {
  Coordinates: Coordinates,
  CoordinatesBuilder: CoordinatesBuilder
};
