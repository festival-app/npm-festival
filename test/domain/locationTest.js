var chai = require('chai');
var should = chai.should();
var location = require('../../lib/domain/location');

describe('location domain test', function () {

  var name = 'name';
  var state = 'state';
  var country = 'country';
  var street = 'street';
  var zip = 'zip';
  var openingTimes = [{from: 'openingTimes'}];
  var festival = 'festival';

  it('should create domain', function (done) {

    var locationDomain = new location.Location(
      name,
      state,
      country,
      street,
      zip,
      openingTimes,
      festival
    );

    should.exist(locationDomain);
    locationDomain.name.should.be.equal(name);
    locationDomain.state.should.be.equal(state);
    locationDomain.country.should.be.equal(country);
    locationDomain.street.should.be.equal(street);
    locationDomain.zip.should.be.equal(zip);
    locationDomain.openingTimes.should.be.equal(openingTimes);
    locationDomain.festival.should.be.equal(festival);

    done();
  });

  it('should create domain by builder', function (done) {

    var locationDomain = new location.LocationBuilder()
      .withName(name)
      .withState(state)
      .withCountry(country)
      .withStreet(street)
      .withZip(zip)
      .withOpeningTimes(openingTimes)
      .withFestival(festival)
      .build();

    should.exist(locationDomain);
    locationDomain.name.should.be.equal(name);
    locationDomain.state.should.be.equal(state);
    locationDomain.country.should.be.equal(country);
    locationDomain.street.should.be.equal(street);
    locationDomain.zip.should.be.equal(zip);
    locationDomain.openingTimes.should.be.equal(openingTimes);
    locationDomain.festival.should.be.equal(festival);

    done();
  });

});