process.env.NODE_ENV = 'test';

module.exports = {
  festivalId: null,
  festivalPlaceId: null,
  festivalPlaceIdParent: null,
  festivalCategoryId: null,
  festivalCategoryIdParent: null,
  festivalEventId: null
};

before(function (done) {
  console.log('Starting server for functional tests ..');
  var app = require('../lib/app');

  app.startServer(function (err, port) {
    console.log('Starting server on port %d ..[done]', port);
    done();
  });

});