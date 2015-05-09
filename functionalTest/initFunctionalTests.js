process.env.NODE_ENV = 'func-test';

before(function (done) {
  console.log('Starting server for functional tests ..');
  var app = require('../lib/app');

  app.startServer(function (err, port) {
    console.log('Starting server on port %d ..[done]', port);
    done();
  });

});