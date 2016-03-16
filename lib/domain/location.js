'use strict';

var Location = function Location(name, state, country, street, city, zip, openingTimes, coordinates, festival) {
  this.name = name;
  this.state = state;
  this.country = country;
  this.street = street;
  this.city = city;
  this.zip = zip;
  this.openingTimes = openingTimes;
  this.coordinates = coordinates;
  this.festival = festival;
};

var LocationBuilder = function LocationBuilder() {
  this.name = null;
  this.state = null;
  this.country = null;
  this.street = null;
  this.city = null;
  this.zip = null;
  this.openingTimes = null;
  this.coordinates = null;
  this.festival = null;

  var _this = this;

  this.withName = function (name) {
    _this.name = name;
    return _this;
  };

  this.withState = function (state) {
    _this.state = state;
    return _this;
  };

  this.withCountry = function (country) {
    _this.country = country;
    return _this;
  };

  this.withStreet = function (street) {
    _this.street = street;
    return _this;
  };

  this.withCity = function withCity(city) {
    _this.city = city;
    return _this;
  };

  this.withZip = function (zip) {
    _this.zip = zip;
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

  this.build = function () {
    return new Location(
      _this.name,
      _this.state,
      _this.country,
      _this.street,
      _this.city,
      _this.zip,
      _this.openingTimes,
      _this.coordinates,
      _this.festival
    );
  };

};

module.exports = {
  Location: Location,
  LocationBuilder: LocationBuilder
};