var chai = require('chai');
var should = chai.should();
var coordinates = require('../../lib/domain/coordinates');

describe('coordinates model test', function () {

  var lat = 'lat';
  var lon = 'lon';

  it('should create model', function (done) {

    var coordinatesModel = new coordinates.Coordinates(
      lat, 
      lon
    );

    should.exist(coordinatesModel);
    coordinatesModel.lat.should.be.equal(lat);
    coordinatesModel.lon.should.be.equal(lon);
    done();
  });

  it('should create model by builder', function (done) {

    var coordinatesModel = new coordinates.CoordinatesBuilder()
      .withLat(lat)
      .withLon(lon)
      .build();

    should.exist(coordinatesModel);
    coordinatesModel.lat.should.be.equal(lat);
    coordinatesModel.lon.should.be.equal(lon);
    done();
  });

});
