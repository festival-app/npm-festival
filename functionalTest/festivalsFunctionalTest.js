//require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');

const FESTIVAL_ID = config.get('test.festival.valid');

describe('festivals functional test', function () {

  //it('should return valid festival for id', function (done) {
  //
  //  hippie()
  //    .header('User-Agent', config.test.ua)
  //    .json()
  //    .header('Accept', config.test.accept)
  //    .get(config.test.host + '/api/festivals/' + FESTIVAL_ID)
  //    .expectStatus(200)
  //    .expectValue('id', FESTIVAL_ID)
  //    .end(function (err, res, body) {
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
  //
  //it('should create user', function (done) {
  //
  //  hippie()
  //    .header('User-Agent', config.test.ua)
  //    .header('x-auth-user-id', ANONYMOUS_USER_ID)
  //    .json()
  //    .header('Accept', config.test.accept)
  //    .post(config.test.host + '/api/festivals')
  //    .send({ name: 'UTC' })
  //    .expectStatus(201)
  //    .expectValue('name', 'UTC')
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

  //it('should return festivals', function (done) {
  //
  //  hippie()
  //    .header('User-Agent', config.test.ua)
  //    .json()
  //    .header('Accept', config.test.accept)
  //    .get(config.test.host + '/api/festivals')
  //    .expectStatus(200)
  //    .expectBody(/total/g)
  //    .expectBody(/festivals/g)
  //    .end(function (err, res, body) {
  //
  //      //console.log(body);
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