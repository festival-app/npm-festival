var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var CategoryBreadcrumbs = require('../../lib/breadcrumbs/categoryBreadcrumbs').CategoryBreadcrumbs;

describe('category breadcrumbs test', function () {

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
    getFestivalCategories: function getFestivalCategories(id, searchRequest, options, callback) {
      var result = {};

      switch (id) {
        case 'PyrkonID':
          result = {
            total: 19,
            categories: [
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
            categories: [
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
            categories: [
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

  var categoryBreadcrumbs = new CategoryBreadcrumbs(festivals);

  it('should have parents and children', function (done) {

    categoryBreadcrumbs.rebuild(function (err, result) {

      should.exist(result);
      var category = categoryBreadcrumbs.get('KapitularzID', 'KapitularzA1');

      category.id.should.be.equal('KapitularzA1');
      category.parent.should.be.equal('KapitularzA');
      category.name.should.be.equal('A1');
      expect(category).to.have.deep.property('parents[0].id', 'KapitularzA');
      expect(category).to.have.deep.property('parents[0].name', 'A');
      expect(category).to.have.deep.property('children[0].id', 'KapitularzA12');
      expect(category).to.have.deep.property('children[0].name', 'A12');
      done();
    });
  });

  it('should have only children', function (done) {

    categoryBreadcrumbs.rebuild(function (err, result) {

      should.exist(result);
      var category = categoryBreadcrumbs.get('KapitularzID', 'KapitularzA');

      category.id.should.be.equal('KapitularzA');
      expect(category.parent).to.be.null;
      expect(category.parents).to.be.empty;
      category.name.should.be.equal('A');
      expect(category).to.have.deep.property('children[0].id', 'KapitularzA1');
      expect(category).to.have.deep.property('children[0].name', 'A1');
      expect(category).to.have.deep.property('children[1].id', 'KapitularzA2');
      expect(category).to.have.deep.property('children[1].name', 'A2');
      done();
    });
  });

  it('should have only parents', function (done) {

    categoryBreadcrumbs.rebuild(function (err, result) {

      should.exist(result);

      var category = categoryBreadcrumbs.get('KapitularzID', 'KapitularzA12');

      category.id.should.be.equal('KapitularzA12');
      category.name.should.be.equal('A12');
      category.parent.should.be.equal('KapitularzA1');
      expect(category.children).to.be.empty;
      expect(category).to.have.deep.property('parents[0].id', 'KapitularzA1');
      expect(category).to.have.deep.property('parents[0].name', 'A1');
      expect(category).to.have.deep.property('parents[1].id', 'KapitularzA');
      expect(category).to.have.deep.property('parents[1].name', 'A');
      done();
    });
  });

});