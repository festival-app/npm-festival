var funcTest = require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('uuid');

describe('festivals delete functional test', function () {


  it('should delete news for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .del(config.test.host + '/api/news/' + funcTest.newsId)
      .expectStatus(204)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();
      });
  });


  it('should delete news for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .del(config.test.host + '/api/festivals/' + funcTest.festivalId + '/news/' + funcTest.festivalNewsId)
      .expectStatus(204)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();
      });
  });



  it('should delete festival place for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .del(config.test.host + '/api/festivals/' + funcTest.festivalId + '/places/' + funcTest.festivalPlaceIdParent)
      .expectStatus(204)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();
      });
  });


  it('should delete festival category for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .del(config.test.host + '/api/festivals/' + funcTest.festivalId + '/categories/' + funcTest.festivalCategoryIdParent)
      .expectStatus(204)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();
      });
  });


  it('should delete festival event for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .del(config.test.host + '/api/festivals/' + funcTest.festivalId + '/events/' + funcTest.festivalEventId)
      .expectStatus(204)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();
      });
  });


  it('should delete festival for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .header('Authorization', 'Bearer ' + funcTest.token)
      .json()
      .header('Accept', config.test.accept)
      .del(config.test.host + '/api/festivals/' + funcTest.festivalId)
      .expectStatus(204)
      .end(function (err, res, body) {

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();
      });
  });

});