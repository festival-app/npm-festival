var funcTest = require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('uuid');

describe('festivals functional test', function () {

  it('should create festival', function (done) {

    var now = moment();

    var json = {
      name: 'festival-name',
      description: 'festival-description',
      type: 'FANTASY',
      status: 'CREATED',
      tags: ['festival-tag1', 'festival-tag2'],
      duration: {
        startAt: now.toISOString(),
        finishAt: moment(now).add(2, 'days').toISOString()
      },
      locations: [
        {
          name: 'Międzynarodowe targi Poznańskie',
          state: 'wielkopolskie',
          country: 'PL',
          street: 'street',
          city: 'city',
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
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
      .expectValue('description', json.description)
      .expectValue('type', json.type)
      .expectValue('status', json.status)
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
      .end(function (err, res, body) {

        funcTest.festivalId = body.id;

        if (err) {
          console.warn(err, body);
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
      type: 'FANTASY',
      status: 'CREATED',
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
          city: 'city',
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
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/festivals/' + funcTest.festivalId)
      .send(json)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalId)
      .expectValue('name', json.name)
      .expectValue('description', json.description)
      .expectValue('type', json.type)
      .expectValue('status', json.status)
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
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

  it('should get festivals collection', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals')
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/festivals/g)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

  it('should get valid festival for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalId)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

});