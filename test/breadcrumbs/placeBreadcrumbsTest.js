var chai = require('chai');
var should = chai.should();
var PlaceBreadcrumbs = require('../../lib/breadcrumbs/placeBreadcrumbs').PlaceBreadcrumbs;

describe('place breadcrumbs test', function () {

  var festivals = {
    getFestivals: function getFestivals(searchRequest, options, callback) {
      return callback(null, {
        total: 89,
        festivals: [
          {
            id: '7e0363d2-6787-4e46-b77b-1794f0c54891',
            name: 'Polcon 2014'
          },
          {
            id: '999227ac-03aa-4419-adbd-444f1c96f3eb',
            name: 'Pyrkon 2015'
          },
          {
            id: 'b07c491f-6f91-4a22-9d5c-0365afb8c424',
            name: 'Kapitularz 2014'
          }
        ]
      });
    },
    getFestivalCategories: function getFestivalCategories(id, searchRequest, options, callback) {
      var result = {};

      switch (id) {
        case '999227ac-03aa-4419-adbd-444f1c96f3eb':
          result = {
            total: 19,
            categories: [
              {
                id: '0f2d4feb-7a21-4814-b574-94fbdfa6ec64',
                parent: null,
                name: 'B'
              },
              {
                id: 'ed935bcf-4157-490f-9bad-da074b61f873',
                parent: '0f2d4feb-7a21-4814-b574-94fbdfa6ec64',
                name: 'B1'
              }
            ]
          };
          break;
        case '7e0363d2-6787-4e46-b77b-1794f0c54891':
          result = {
            total: 1,
            categories: [
              {
                id: '6c7e2516-48a9-4ce6-9835-383516f580f2',
                parent: null,
                name: 'Polcon 2014'
              }
            ]
          };
          break;
        case 'b07c491f-6f91-4a22-9d5c-0365afb8c424':
          result = {
            total: 10,
            categories: [
              {
                id: '3a50a754-31ff-439b-9a68-2de3defc64ba',
                parent: null,
                name: 'A'
              },
              {
                id: '3b61c99c-b12a-4729-b249-5ea8d7570ee9',
                parent: '3a50a754-31ff-439b-9a68-2de3defc64ba',
                name: 'A1'
              },
              {
                id: '3a50a754-b12a-4729-b249-5ea8d7570ee9',
                parent: '3a50a754-31ff-439b-9a68-2de3defc64ba',
                name: 'A2'
              },
              {
                id: '3b61c99c-b12a-4729-b249-0365afb8c424',
                parent: '3b61c99c-b12a-4729-b249-5ea8d7570ee9',
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

  it('should build map', function (done) {

    placeBreadcrumbs.rebuild(function (err, result) {

      should.exist(result);

        var place = placeBreadcrumbs.get('b07c491f-6f91-4a22-9d5c-0365afb8c424', '3b61c99c-b12a-4729-b249-0365afb8c424');
      console.dir(place, {depth: null});

      var place2 = placeBreadcrumbs.get('b07c491f-6f91-4a22-9d5c-0365afb8c424', '3b61c99c-b12a-4729-b249-5ea8d7570ee9');
      console.dir(place2, {depth: null});

      done();
    });
  });

});