process.env.NODE_ENV = 'test';

before(function (done) {
  console.log('Starting server..');
  require('../api');
  done();
});