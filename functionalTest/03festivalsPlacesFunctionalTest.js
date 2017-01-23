var funcTest = require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('uuid');

describe('festivals places functional test', function () {

  it('should create festival place (parent)', function (done) {

    var now = moment();

    var json = {
      name: 'place-name',
      openingTimes: [
        {
          startAt: now.toISOString(),
          finishAt: moment(now).add(8, 'hours').toISOString()
        }
      ]
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals/' + funcTest.festivalId + '/places')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
      .expectBody(/id/g)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err, res, body) {

        funcTest.festivalPlaceIdParent = body.id;

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

  it('should create festival place with parent', function (done) {

    var now = moment();

    var json = {
      name: 'place-name',
      parent: funcTest.festivalPlaceIdParent,
      openingTimes: [
        {
          startAt: now.toISOString(),
          finishAt: moment(now).add(8, 'hours').toISOString()
        }
      ]
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/festivals/' + funcTest.festivalId + '/places')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
      .expectBody(/id/g)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err, res, body) {

        funcTest.festivalPlaceId = body.id;

        if (err) {
          console.warn(err, body);
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
      parent: funcTest.festivalPlaceIdParent,
      openingTimes: [
        {
          startAt: now.toISOString(),
          finishAt: moment(now).add(8, 'hours').toISOString()
        }
      ]
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/festivals/' + funcTest.festivalId + '/places/' + funcTest.festivalPlaceId)
      .send(json)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalPlaceId)
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

  it('should get festival place for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId + '/places/' + funcTest.festivalPlaceId)
      .expectStatus(200)
      .expectValue('id', funcTest.festivalPlaceId)
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

  it('should get festival places collection', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/festivals/' + funcTest.festivalId + '/places')
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/places/g)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });


});