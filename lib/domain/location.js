'use strict';

class Location {
  constructor(name, state, country, street, city, zip, openingTimes, coordinates, festival) {
    this.name = name;
    this.state = state;
    this.country = country;
    this.street = street;
    this.city = city;
    this.zip = zip;
    this.openingTimes = openingTimes;
    this.coordinates = coordinates;
    this.festival = festival;
  }
}

class LocationBuilder {
  constructor() {
    this.name = null;
    this.state = null;
    this.country = null;
    this.street = null;
    this.city = null;
    this.zip = null;
    this.openingTimes = null;
    this.coordinates = null;
    this.festival = null;
  }

  withName(name) {
    this.name = name;
    return this;
  };

  withState(state) {
    this.state = state;
    return this;
  };

  withCountry(country) {
    this.country = country;
    return this;
  };

  withStreet(street) {
    this.street = street;
    return this;
  };

  withCity(city) {
    this.city = city;
    return this;
  };

  withZip(zip) {
    this.zip = zip;
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

  build() {
    return new Location(
      this.name,
      this.state,
      this.country,
      this.street,
      this.city,
      this.zip,
      this.openingTimes,
      this.coordinates,
      this.festival
    );
  }
}

module.exports = {
  Location: Location,
  LocationBuilder: LocationBuilder
};
