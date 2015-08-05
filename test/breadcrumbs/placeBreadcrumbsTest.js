var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var PlaceBreadcrumbs = require('../../lib/breadcrumbs/placeBreadcrumbs').PlaceBreadcrumbs;

describe('place breadcrumbs test', function () {

  var festivals = {
    getFestivals: function getFestivals(searchRequest, options, callback) {
      return callback(null, {
        total: 89,
        festivals: [
          {
            id: 'PolconID',
            name: 'Polcon 2014'
          },
          {
            id: 'PyrkonID',
            name: 'Pyrkon 2015'
          },
          {
            id: 'KapitularzID',
            name: 'Kapitularz 2014'
          }
        ]
      });
    },
    getFestivalPlaces: function getFestivalPlaces(id, searchRequest, options, callback) {
      var result = {};

      switch (id) {
        case 'PyrkonID':
          result = {
            total: 19,
            places: [
              {
                id: 'PyrkonB',
                parent: null,
                name: 'B'
              },
              {
                id: 'PyrkonB1',
                parent: 'PyrkonB',
                name: 'B1'
              }
            ]
          };
          break;
        case 'PolconID':
          result = {
            total: 1,
            places: [
              {
                id: 'PolconC',
                parent: null,
                name: 'C'
              }
            ]
          };
          break;
        case 'KapitularzID':
          result = {
            total: 10,
            places: [
              {
                id: 'KapitularzA',
                parent: null,
                name: 'A'
              },
              {
                id: 'KapitularzA1',
                parent: 'KapitularzA',
                name: 'A1'
              },
              {
                id: 'KapitularzA2',
                parent: 'KapitularzA',
                name: 'A2'
              },
              {
                id: 'KapitularzA12',
                parent: 'KapitularzA1',
                name: 'A12'
              }
            ]
          };
          break;
      }

      return callback(null, result);
    }
  };

  var placeBreadcrumbs = new PlaceBreadcrumbs(festivals);

  it('should have parents and children', function (done) {

    placeBreadcrumbs.rebuild(function (err, result) {

      should.exist(result);
      var place = placeBreadcrumbs.get('KapitularzID', 'KapitularzA1');

      place.id.should.be.equal('KapitularzA1');
      place.parent.should.be.equal('KapitularzA');
      place.name.should.be.equal('A1');
      expect(place).to.have.deep.property('parents[0].id', 'KapitularzA');
      expect(place).to.have.deep.property('parents[0].name', 'A');
      expect(place).to.have.deep.property('children[0].id', 'KapitularzA12');
      expect(place).to.have.deep.property('children[0].name', 'A12');
      done();
    });
  });

  it('should have only children', function (done) {

    placeBreadcrumbs.rebuild(function (err, result) {

      should.exist(result);
      var place = placeBreadcrumbs.get('KapitularzID', 'KapitularzA');

      place.id.should.be.equal('KapitularzA');
      expect(place.parent).to.be.null;
      expect(place.parents).to.be.empty;
      place.name.should.be.equal('A');
      expect(place).to.have.deep.property('children[0].id', 'KapitularzA1');
      expect(place).to.have.deep.property('children[0].name', 'A1');
      expect(place).to.have.deep.property('children[1].id', 'KapitularzA2');
      expect(place).to.have.deep.property('children[1].name', 'A2');
      done();
    });
  });

  it('should have only parents', function (done) {

    placeBreadcrumbs.rebuild(function (err, result) {

      should.exist(result);

      var place = placeBreadcrumbs.get('KapitularzID', 'KapitularzA12');

      place.id.should.be.equal('KapitularzA12');
      place.name.should.be.equal('A12');
      place.parent.should.be.equal('KapitularzA1');
      expect(place.children).to.be.empty;
      expect(place).to.have.deep.property('parents[0].id', 'KapitularzA1');
      expect(place).to.have.deep.property('parents[0].name', 'A1');
      expect(place).to.have.deep.property('parents[1].id', 'KapitularzA');
      expect(place).to.have.deep.property('parents[1].name', 'A');
      done();
    });
  });

});