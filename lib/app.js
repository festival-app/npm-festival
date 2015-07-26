var fs = require('fs');
var myRestifyApi = require('my-restify-api');
var UnauthorizedError = myRestifyApi.error.UnauthorizedError;
//var oauth = myRestifyApi.plugin.oauth;

var oauth = function oauth(req) {

  var context = {};
  context.user = function () {
  };

  context.client = function (client) {
    return context;
  };

  context.scope = function (scope) {
    return context;
  };

  return context;
};

var festivalsController = require('./controller/festivals');
var categoriesController = require('./controller/categories');
var eventsController = require('./controller/events');
var placesController = require('./controller/places');

var logger = require('./logger/logger').logger;

var startServer = function startServer(callback) {
  fs.readFile('config/public.key', function (err, data) {
    if (err) {
      logger.debug('config/public.key read error: ', err);
      throw err;
    }

    var options = {
      appName: 'festivals',
      swagger: {
        enabled: true,
        apiDocsDir: __dirname + '/../public/'
      },
      authorization: {
        authHeaderPrefix: 'x-auth-',
        key: data,
        noVerify: false
      },
      bodyParser: {
        enabled: true,
        options: {
          maxBodySize: 1e6,
          mapParams: true,
          overrideParams: false
        }
      },
      acceptable: [
        'application/vnd.festivals.v1+json',
        'application/vnd.festivals.v1+xml'
      ]
    };

    var errorHandlers = {
      EventNotFound: {
        className: 'NotFoundError'
      },
      EventPlaceNotFound: {
        className: 'NotFoundError'
      },
      FestivalNotFound: {
        className: 'NotFoundError'
      },
      ServiceUnavailable: {
        className: 'ServiceUnavailableError'
      }
    };

    var publicCacheHandler = function (req, res, next) {
      res.cache('public', {maxAge: 600});
      res.header('Vary', 'Accept-Language, Accept-Encoding, Accept, Content-Type');
//    res.header('Last-Modified', new Date());
      return next();
    };

    var noCacheHandler = function (req, res, next) {
      res.cache('private');
      return next();
    };

    var routes = {
      get: [],
      post: [],
      put: [],
      delete: []
    };

    routes.get.push({
      options: {
        path: '/api/festivals', version: '1.0.0'
      },
      authMethod: function readFestivalsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('festivals:get')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: festivalsController.getFestivalsV1
    });

    routes.post.push({
      options: {
        path: '/api/festivals', version: '1.0.0'
      },
      authMethod: function createFestivalsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('festivals:create')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: festivalsController.createFestivalV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id', version: '1.0.0'
      },
      authMethod: function readFestivalsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('festivals:get')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: festivalsController.getFestivalV1
    });

    routes.put.push({
      options: {
        path: '/api/festivals/:id', version: '1.0.0'
      },
      authMethod: function updateFestivalsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('festivals:update')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: festivalsController.updateFestivalV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/categories', version: '1.0.0'
      },
      authMethod: function readCategoriesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('categories:get')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: categoriesController.getFestivalCategoriesV1
    });

    routes.post.push({
      options: {
        path: '/api/festivals/:id/categories', version: '1.0.0'
      },
      authMethod: function createCategoriesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('categories:create')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: categoriesController.createFestivalCategoryV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/categories/:category.id', version: '1.0.0'
      },
      authMethod: function readCategoriesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('categories:get')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: categoriesController.getFestivalCategoryV1
    });

    routes.put.push({
      options: {
        path: '/api/festivals/:id/categories/:category.id', version: '1.0.0'
      },
      authMethod: function updateCategoriesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('categories:update')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: categoriesController.updateFestivalCategoryV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/events', version: '1.0.0'
      },
      authMethod: function readEventsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('events:get')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: eventsController.getFestivalEventsV1
    });

    routes.post.push({
      options: {
        path: '/api/festivals/:id/events', version: '1.0.0'
      },
      authMethod: function createEventsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('events:create')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: eventsController.createFestivalEventV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/events/:event.id', version: '1.0.0'
      },
      authMethod: function readEventsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('events:get')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: eventsController.getFestivalEventV1
    });

    routes.put.push({
      options: {
        path: '/api/festivals/:id/events/:event.id', version: '1.0.0'
      },
      authMethod: function updateEventsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('events:update')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: eventsController.updateFestivalEventV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/places', version: '1.0.0'
      },
      authMethod: function readPlacesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('places:get')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: placesController.getFestivalPlacesV1
    });

    routes.post.push({
      options: {
        path: '/api/festivals/:id/places', version: '1.0.0'
      },
      authMethod: function createPlacesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('places:create')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: placesController.createFestivalPlaceV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/places/:place.id', version: '1.0.0'
      },
      authMethod: function readPlacesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('places:get')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: placesController.getFestivalPlaceV1
    });

    routes.put.push({
      options: {
        path: '/api/festivals/:id/places/:place.id', version: '1.0.0'
      },
      authMethod: function updatePlacesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('places:update')
            .client('client')
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: placesController.updateFestivalPlaceV1
    });

    var server = myRestifyApi.createServer(routes, errorHandlers, options);

    myRestifyApi.runServer(server, options, function (err, port) {
      logger.debug('myRestifyApi running on port: %d', port);
      return callback(err, port);
    });
  });
};

module.exports = {
  startServer: startServer
};
