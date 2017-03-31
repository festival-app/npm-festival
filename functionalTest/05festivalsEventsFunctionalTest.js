var funcTest = require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('uuid');

describe('festivals events functional test', function () {

  it('should create festival event', function (done) {

    var now = moment();

    var json = {
      name: 'event-name',
      description: 'event-description',
      status: 'CREATED',
      tags: ['event-tag1', 'event-tag2'],
      duration: {
        startAt: now.toISOString(),
        finishAt: moment(now).add(2, 'hours').toISOString()
      },
      images: [
        {
          url: 'http://podgk.pl/wp-content/uploads/2011/06/dni_fantastyki_podgk.jpg',
          order: 0
        }
      ],
      place: funcTest.festivalPlaceId,
      category: funcTest.festivalCategoryId
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals/' + funcTest.festivalId + '/events')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
      .expectValue('description', json.description)
      .expectValue('status', json.status)
      // .expectValue('tags', json.tags)
      .expectValue('mainImage.small', json.images[0].url)
      .expectValue('mainImage.medium', json.images[0].url)
      .expectValue('mainImage.large', json.images[0].url)
      .expectValue('duration.periodMs', 7200000)
      // .expectValue('place.id', funcTest.festivalPlaceId) //TODO
      // .expectValue('category.id', funcTest.festivalCategoryId)
      .expectBody(/id/g)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .expectBody(/place/g)
      .expectBody(/category/g)
      .end(function (err, res, body) {

        funcTest.festivalEventId = body.id;

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

  it('should update festival event for id', function (done) {

    var now = moment();
    var id = uuid.v4();

    var json = {
      name: 'event-name-' + id,
      description: 'event-description-' + id,
      status: 'CREATED',
      tags: ['event-tag1' + id, 'event-tag2-' + id],
      duration: {
        startAt: now.toISOString(),
        finishAt: moment(now).add(2, 'hours').toISOString()
      },
      images: [
        {
          url: 'http://podgk.pl/wp-content/uploads/2011/06/dni_fantastyki_podgk.jpg?' + id,
          order: 0
        }
      ],
      place: funcTest.festivalPlaceId,
      category: funcTest.festivalCategoryId
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/festivals/' + funcTest.festivalId + '/events/' + funcTest.festivalEventId)
      .send(json)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalEventId)
      .expectValue('name', json.name)
      .expectValue('description', json.description)
      .expectValue('status', json.status)
      // .expectValue('tags', json.tags)
      .expectValue('mainImage.small', json.images[0].url)
      .expectValue('mainImage.medium', json.images[0].url)
      .expectValue('mainImage.large', json.images[0].url)
      .expectValue('duration.periodMs', 7200000)
      //.expectValue('place.id', funcTest.festivalPlaceId)
      //.expectValue('category.id', funcTest.festivalCategoryId)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .expectBody(/place/g)
      .expectBody(/category/g)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

  it('should get festival event for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId + '/events/' + funcTest.festivalEventId)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalEventId)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .expectBody(/place/g)
      .expectBody(/category/g)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

  it('should get festival events collection', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId + '/events')
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/events/g)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

});