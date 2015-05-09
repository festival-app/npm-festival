require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('node-uuid');

const FESTIVAL_ID = config.get('test.festival.valid');
const EVENT_ID = config.get('test.event.valid');

describe('festivals events functional test', function () {

  it('should create festival event', function (done) {

    var now = moment();

    var json = {
      name: 'event-name',
      description: 'event-description',
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
      place: 'place',
      category: 'category'
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/events')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
      .expectValue('description', json.description)
      .expectValue('tags', json.tags)
      .expectValue('mainImage.small', json.images[0].url)
      .expectValue('mainImage.medium', json.images[0].url)
      .expectValue('mainImage.large', json.images[0].url)
      .expectValue('duration.periodMs', 7200000)
      .expectBody(/id/g)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .expectBody(/place/g)
      .expectBody(/category/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should update festival event for id', function (done) {

    var now = moment();
    var id = uuid.v4();

    var json = {
      name: 'event-name' + id,
      description: 'event-description' + id,
      tags: ['event-tag1' + id, 'event-tag2' + id],
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
      place: 'place' + id,
      category: 'category' + id
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/events/' + EVENT_ID)
      .send(json)
      .expectStatus(200)
      .expectValue('id', EVENT_ID)
      .expectValue('name', json.name)
      .expectValue('description', json.description)
      .expectValue('tags', json.tags)
      .expectValue('mainImage.small', json.images[0].url)
      .expectValue('mainImage.medium', json.images[0].url)
      .expectValue('mainImage.large', json.images[0].url)
      .expectValue('duration.periodMs', 7200000)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .expectBody(/place/g)
      .expectBody(/category/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should return festival event for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/events/' + EVENT_ID)
      .expectStatus(200)
      .expectValue('id', EVENT_ID)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .expectBody(/place/g)
      .expectBody(/category/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should return festival events collection', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/events')
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/events/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  //it('should return not found for invalid user id', function (done) {
  //
  //  hippie()
  //    .header('User-Agent', config.test.ua)
  //    .header('x-auth-user-id', ANONYMOUS_USER_ID)
  //    .json()
  //    .header('Accept', config.test.accept)
  //    .get(config.test.host + '/api/festivals/' + INVALID_USER_ID)
  //    .expectStatus(404)
  //    .expectValue('code', 'NotFoundError')
  //    .expectValue('message', 'User not found')
  //    .expectValue('userMessage', 'Nie znaleziono')
  //    .end(function (err/*, res, body*/) {
  //
  //      if (err) {
  //        throw err;
  //      }
  //
  //      done();
  //
  //    });
  //});
  //
  //it('should return error on create user without parameters', function (done) {
  //
  //  hippie()
  //    .header('User-Agent', config.test.ua)
  //    .header('x-auth-user-id', ANONYMOUS_USER_ID)
  //    .json()
  //    .header('Accept', config.test.accept)
  //    .post(config.test.host + '/api/festivals')
  //    .expectStatus(400)
  //    .expectValue('code', 'BadRequestError')
  //    .expectValue('message', 'name (string) is required')
  //    .expectValue('userMessage', 'Przekazane dane są niepoprawne lub niepełne')
  //    .end(function (err/*, res, body*/) {
  //
  //      if (err) {
  //        throw err;
  //      }
  //
  //      done();
  //
  //    });
  //});

});