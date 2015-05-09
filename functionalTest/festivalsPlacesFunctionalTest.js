require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('node-uuid');

const FESTIVAL_ID = config.get('test.festival.valid');
const PLACE_ID = config.get('test.place.valid');
const PARENT_PLACE_ID = config.get('test.place.parent');

describe('festivals places functional test', function () {

  it('should create festival place', function (done) {

    var now = moment();

    var json = {
      name: 'place-name',
      parent: PARENT_PLACE_ID,
      openingTimes: [
        {
          startAt: now.toISOString(),
          finishAt: moment(now).add(8, 'hours').toISOString()
        }
      ]
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/places')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
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

  it('should update festival place for id', function (done) {

    var now = moment();
    var id = uuid.v4();

    var json = {
      name: 'place-name',
      parent: PARENT_PLACE_ID,
      openingTimes: [
        {
          startAt: now.toISOString(),
          finishAt: moment(now).add(8, 'hours').toISOString()
        }
      ]
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/places/' + PLACE_ID)
      .send(json)
      .expectStatus(200)
      .expectValue('id', PLACE_ID)
      .expectValue('name', json.name)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should return festival place for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/places/' + PLACE_ID)
      .expectStatus(200)
      .expectValue('id', PLACE_ID)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should return festival places collection', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/places')
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/places/g)
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