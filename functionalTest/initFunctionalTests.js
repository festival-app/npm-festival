process.env.NODE_ENV = 'test';

var querystring = require('querystring');
var config = require('config');
var http = require('https');

module.exports = {
  token: null,
  festivalId: null,
  festivalPlaceId: null,
  festivalPlaceIdParent: null,
  festivalCategoryId: null,
  festivalCategoryIdParent: null,
  festivalEventId: null,
  newsId: null,
  festivalNewsId: null
};

var postData = querystring.stringify({
  'username': config.credentials.user,
  'password': config.credentials.password,
  'client_id': config.credentials.clientId,
  'grant_type': 'password'
});

before(function (done) {
  var req = http.request(config.credentials.clientOptions, function (res) {
    if (res.statusCode !== 200) {
      console.log('unexpected status for token: ' + res.statusCode);
    }

    res.setEncoding('utf8');

    var data = '';

    res.on('end', function () {

      var json = JSON.parse(data);

      if (json.access_token) {
        module.exports.token = json.access_token;

        console.log('Starting server for functional tests ..');
        var app = require('../lib/app');

        app.startServer(function (err, port) {
          console.log('Starting server on port %d ..[done]', port);
          done();
        });
      } else {
        done(new Error('Unable to get token'));
      }
    });

    res.on('data', function (d) {
      data += d;
    });

  });

  req.on('error', function (e) {
    console.log('problem with auth token request: ' + e.message);
    done(e);
  });

  req.write(postData);
  req.end();
});