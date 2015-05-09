require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('node-uuid');

const FESTIVAL_ID = config.get('test.festival.valid');
const CATEGORY_ID = config.get('test.category.valid');
const PARENT_CATEGORY_ID = config.get('test.category.parent');

describe('festivals categories functional test', function () {

  it('should create festival category', function (done) {

    var json = {
      name: 'category-name',
      parent: PARENT_CATEGORY_ID
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/categories')
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

  it('should update festival category for id', function (done) {

    var id = uuid.v4();

    var json = {
      name: 'category-name',
      parent: PARENT_CATEGORY_ID
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/categories/' + CATEGORY_ID)
      .send(json)
      .expectStatus(200)
      .expectValue('id', CATEGORY_ID)
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

  it('should return festival category for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/categories/' + CATEGORY_ID)
      .expectStatus(200)
      .expectValue('id', CATEGORY_ID)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err/*, res, body*/) {

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should return festival categories collection', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + FESTIVAL_ID + '/categories')
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/categories/g)
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