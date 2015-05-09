require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('node-uuid');

const FESTIVAL_ID = config.get('test.festival.valid');

describe('festivals functional test', function () {

  it('should create festival', function (done) {

    var now = moment();

    var json = {
      name: 'festival-name',
      description: 'festival-description',
      tags: ['festival-tag1', 'festival-tag2'],
      duration: {
        startAt: now.toISOString(),
        finishAt: moment(now).add(2, 'days').toISOString()
      },
      locations: [
        {
          name: 'Międzynarodowe targi Poznańskie',
          state: 'wielkopolska',
          country: 'PL',
          street: 'street',
          zip: 'zip',
          openingTimes: [
            {
              startAt: now.toISOString(),
              finishAt: moment(now).add(2, 'hours').toISOString()
            }
          ]
        }
      ],
      images: [
        {
          url: 'http://podgk.pl/wp-content/uploads/2011/06/dni_fantastyki_podgk.jpg',
          order: 0
        }
      ]
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
      .expectValue('description', json.description)
      .expectValue('tags', json.tags)
      .expectValue('mainImage.small', json.images[0].url)
      .expectValue('mainImage.medium', json.images[0].url)
      .expectValue('mainImage.large', json.images[0].url)
      .expectValue('duration.periodMs', 172800000)
      .expectValue('locations[0].name', json.locations[0].name)
      .expectValue('locations[0].state', json.locations[0].state)
      .expectValue('locations[0].country', json.locations[0].country)
      .expectValue('locations[0].street', json.locations[0].street)
      .expectValue('locations[0].zip', json.locations[0].zip)
      .expectBody(/id/g)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should update festival for id', function (done) {

    var now = moment();
    var id = uuid.v4();

    var json = {
      name: 'festival-name' + id,
      description: 'festival-description' + id,
      tags: ['festival-tag1' + id, 'festival-tag2' + id],
      duration: {
        startAt: now.toISOString(),
        finishAt: moment(now).add(2, 'days').toISOString()
      },
      locations: [
        {
          name: 'Międzynarodowe targi Poznańskie' + id,
          state: 'wielkopolska' + id,
          country: 'PL',
          street: 'street' + id,
          zip: 'zip' + id,
          openingTimes: [
            {
              startAt: now.toISOString(),
              finishAt: moment(now).add(2, 'hours').toISOString()
            }
          ]
        }
      ],
      images: [
        {
          url: 'http://podgk.pl/wp-content/uploads/2011/06/dni_fantastyki_podgk.jpg?' + id,
          order: 0
        }
      ]
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/festivals/' + FESTIVAL_ID)
      .send(json)
      .expectStatus(200)
      .expectValue('id', FESTIVAL_ID)
      .expectValue('name', json.name)
      .expectValue('description', json.description)
      .expectValue('tags', json.tags)
      .expectValue('mainImage.small', json.images[0].url)
      .expectValue('mainImage.medium', json.images[0].url)
      .expectValue('mainImage.large', json.images[0].url)
      .expectValue('duration.periodMs', 172800000)
      .expectValue('locations[0].name', json.locations[0].name)
      .expectValue('locations[0].state', json.locations[0].state)
      .expectValue('locations[0].country', json.locations[0].country)
      .expectValue('locations[0].street', json.locations[0].street)
      .expectValue('locations[0].zip', json.locations[0].zip)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should return festivals', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals')
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/festivals/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should return valid festival for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + FESTIVAL_ID)
      .expectStatus(200)
      .expectValue('id', FESTIVAL_ID)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

});