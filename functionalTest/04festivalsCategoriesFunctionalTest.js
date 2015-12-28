var funcTest = require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('node-uuid');

describe('festivals categories functional test', function () {

  var categoryName = 'category-name-' + uuid.v4();

  it('should create festival category (parent)', function (done) {

    var json = {
      name: categoryName
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
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
          console.warn(err, body);
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
      .header('Authorization', 'Bearer ' + funcTest.token)
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
          console.warn(err, body);
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
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories/' + funcTest.festivalCategoryId)
      .send(json)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalCategoryId)
      .expectValue('name', json.name)
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

  it('should get festival category for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories/' + funcTest.festivalCategoryId)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalCategoryId)
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

  it('should return festival categories collection', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories')
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/categories/g)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

  it('should return festival categories collection filter by category name', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories?name=' + categoryName)
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/categories/g)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

});