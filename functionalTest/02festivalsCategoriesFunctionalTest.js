var funcTest = require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('node-uuid');

describe('festivals categories functional test', function () {

  it('should create festival category (parent)', function (done) {

    var json = {
      name: 'category-name'
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
      .expectBody(/id/g)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err, res, body) {

        funcTest.festivalCategoryIdParent = body.id;

        if (err) {
          throw err;
        }

        done();

      });
  });

  it('should create festival category with parent', function (done) {

    var json = {
      name: 'category-name',
      parent: funcTest.festivalCategoryIdParent
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
      .expectBody(/id/g)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err, res, body) {

        funcTest.festivalCategoryId = body.id;

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
      parent: funcTest.festivalCategoryIdParent
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories/' + funcTest.festivalCategoryId)
      .send(json)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalCategoryId)
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

  it('should get festival category for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories/' + funcTest.festivalCategoryId)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalCategoryId)
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
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories')
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