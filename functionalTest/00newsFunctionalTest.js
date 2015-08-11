var funcTest = require('./initFunctionalTests');
var config = require('config');
var hippie = require('hippie');
var moment = require('moment');
var uuid = require('node-uuid');

describe('news functional test', function () {

  it('should create news', function (done) {

    var json = {
      name: 'news-name',
      description: 'news-description',
      tags: ['news-tag01', 'news-tag02'],
      authors: [{name: 'author-name', organization: 'organization'}],
      images: [
        {
          url: 'http://podgk.pl/wp-content/uploads/2011/06/dni_fantastyki_podgk.jpg',
          order: 0
        }
      ]
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .post(config.test.host + '/api/news')
      .send(json)
      .expectStatus(201)
      .expectValue('name', json.name)
      .expectValue('description', json.description)
      .expectValue('tags', json.tags)
      .expectValue('authors[0].name', json.authors[0].name)
      .expectValue('authors[0].organization', json.authors[0].organization)
      .expectValue('mainImage.small', json.images[0].url)
      .expectValue('mainImage.medium', json.images[0].url)
      .expectValue('mainImage.large', json.images[0].url)
      .expectBody(/id/g)
      .expectBody(/createdAt/g)
      .expectBody(/updatedAt/g)
      .end(function (err, res, body) {

        funcTest.newsId = body.id;

        if (err) {
          console.warn(err, body);
          throw err;
        }

        done();

      });
  });

  it('should update news for id', function (done) {

    var id = uuid.v4();

    var json = {
      name: 'updated-news-name'
    };

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .put(config.test.host + '/api/news/' + funcTest.newsId)
      .send(json)
      .expectStatus(200)
      .expectValue('id', funcTest.newsId)
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

  it('should get news for id', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/news/' + funcTest.newsId)
      .expectStatus(200)
      .expectValue('id', funcTest.newsId)
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

  it('should return news collection', function (done) {

    hippie()
      .header('User-Agent', config.test.ua)
      .json()
      .header('Accept', config.test.accept)
      .get(config.test.host + '/api/news')
      .expectStatus(200)
      .expectBody(/total/g)
      .expectBody(/news/g)
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

});