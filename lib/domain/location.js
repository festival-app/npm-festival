var Location = function Location(name, state, country, street, zip, openingTimes, festival) {
  this.name = name;
  this.state = state;
  this.country = country;
  this.street = street;
  this.zip = zip;
  this.openingTimes = openingTimes;
  this.festival = festival;
};

var LocationBuilder = function LocationBuilder() {
  this.name = null;
  this.state = null;
  this.country = null;
  this.street = null;
  this.zip = null;
  this.openingTimes = null;
  this.festival = null;

  var self = this;

  this.withName = function (name) {
    self.name = name;
    return self;
  };

  this.withState = function (state) {
    self.state = state;
    return self;
  };

  this.withCountry = function (country) {
    self.country = country;
    return self;
  };

  this.withStreet = function (street) {
    self.street = street;
    return self;
  };

  this.withZip = function (zip) {
    self.zip = zip;
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

  this.build = function () {
    return new Location(
      self.name,
      self.state,
      self.country,
      self.street,
      self.zip,
      self.openingTimes,
      self.festival
    );
  };

};

module.exports = exports = {
  Location: Location,
  LocationBuilder: LocationBuilder
};