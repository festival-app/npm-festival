var fs = require('fs');
var assert = require('assert-plus');
var myRestifyApi = require('my-restify-api');
var UnauthorizedError = myRestifyApi.error.UnauthorizedError;

var oauth = function (req) {

  assert.object(req.authorization, 'authorization');
  assert.object(req.authorization.bearer, 'authorization.bearer');
  var bearer = req.authorization.bearer;
  assert.string(bearer.clientId, 'authorization.bearer.clientId');

  var context = {};
  context.user = function () {
    try {
      assert.string(bearer.userId, 'authorization.bearer.userId');
      assert.string(bearer.username, 'authorization.bearer.username');
      assert.string(bearer.email, 'authorization.bearer.email');

      logger.debug('Looking for username in authorization: "%s"', bearer.username);

      if (['windowsphone_festivals_1.0.x', 'demo'].indexOf(bearer.username) > -1) {
        return context;
      }

      logger.info('Unauthorized user');
      throw new Error('Unauthorized user token');
    }
    catch (e) {
      logger.info('Unauthorized user:', e);
      throw new Error('Unauthorized user token');
    }
  };

  context.client = function () {
    logger.debug('Looking for clientId in authorization: "%s"', bearer.clientId);

    if (['festivals-web-client', 'festivals-windowsphone'].indexOf(bearer.clientId) > -1) {
      return context;
    }

    logger.info('Invalid clientId in oauth authorization: "%s"', bearer.clientId);
    throw new Error('Invalid oauth authorization clientId');
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
var newsController = require('./controller/news');

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
      res.cache('public', {maxAge: 3600});
      res.header('Vary', 'Accept-Language, Accept-Encoding, Accept, Content-Type');
      res.charSet('utf-8');
//    res.header('Last-Modified', new Date());
      return next();
    };

    var noCacheHandler = function (req, res, next) {
      res.cache('private');
      res.charSet('utf-8');
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
            .client()
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
            .client()
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
            .client()
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
            .client()
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

    routes.delete.push({
      options: {
        path: '/api/festivals/:id', version: '1.0.0'
      },
      authMethod: function deleteFestivalsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('festivals:delete')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: festivalsController.deleteFestivalV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/categories', version: '1.0.0'
      },
      authMethod: function readCategoriesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('categories:get')
            .client()
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
            .client()
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
            .client()
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
            .client()
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

    routes.delete.push({
      options: {
        path: '/api/festivals/:id/categories/:category.id', version: '1.0.0'
      },
      authMethod: function deleteCategoriesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('categories:delete')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: categoriesController.deleteFestivalCategoryV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/events', version: '1.0.0'
      },
      authMethod: function readEventsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('events:get')
            .client()
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
            .client()
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
            .client()
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
            .client()
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

    routes.delete.push({
      options: {
        path: '/api/festivals/:id/events/:event.id', version: '1.0.0'
      },
      authMethod: function deleteEventsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('events:delete')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: eventsController.deleteFestivalEventV1
    });


    routes.get.push({
      options: {
        path: '/api/festivals/:id/news', version: '1.0.0'
      },
      authMethod: function readFestivalsNewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:get')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: newsController.getNewsCollectionV1
    });

    routes.post.push({
      options: {
        path: '/api/festivals/:id/news', version: '1.0.0'
      },
      authMethod: function createFestivalsnewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:create')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: newsController.createNewsV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/news/:news.id', version: '1.0.0'
      },
      authMethod: function readFestivalsnewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:get')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: newsController.getNewsV1
    });

    routes.put.push({
      options: {
        path: '/api/festivals/:id/news/:news.id', version: '1.0.0'
      },
      authMethod: function updateFestivalsnewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:update')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: newsController.updateNewsV1
    });

    routes.delete.push({
      options: {
        path: '/api/festivals/:id/news/:news.id', version: '1.0.0'
      },
      authMethod: function deleteFestivalsnewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:delete')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: newsController.deleteNewsV1
    });

    routes.get.push({
      options: {
        path: '/api/news', version: '1.0.0'
      },
      authMethod: function readNewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:get')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: newsController.getNewsCollectionV1
    });

    routes.post.push({
      options: {
        path: '/api/news', version: '1.0.0'
      },
      authMethod: function createNewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:create')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: newsController.createNewsV1
    });

    routes.get.push({
      options: {
        path: '/api/news/:news.id', version: '1.0.0'
      },
      authMethod: function readNewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:get')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: publicCacheHandler,
      controllerMethod: newsController.getNewsV1
    });

    routes.put.push({
      options: {
        path: '/api/news/:news.id', version: '1.0.0'
      },
      authMethod: function updateNewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:update')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: newsController.updateNewsV1
    });

    routes.delete.push({
      options: {
        path: '/api/news/:news.id', version: '1.0.0'
      },
      authMethod: function deleteNewsAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('news:delete')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: newsController.deleteNewsV1
    });

    routes.get.push({
      options: {
        path: '/api/festivals/:id/places', version: '1.0.0'
      },
      authMethod: function readPlacesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('places:get')
            .client()
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
            .client()
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
            .client()
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
            .client()
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

    routes.delete.push({
      options: {
        path: '/api/festivals/:id/places/:place.id', version: '1.0.0'
      },
      authMethod: function deletePlacesAuthHandler(req, res, next) {

        try {
          oauth(req)
            .scope('places:delete')
            .client()
            .user();
        }
        catch (e) {
          return next(new UnauthorizedError('Unauthorized error: ' + e.message));
        }

        return next();
      },
      cache: noCacheHandler,
      controllerMethod: placesController.deleteFestivalPlaceV1
    });

    var server = myRestifyApi.createServer(routes, errorHandlers, options);

    server.opts(/.*/, function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
      res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
      res.send(200);
      return next();
    });

    myRestifyApi.runServer(server, options, function (err, port) {
      logger.debug('myRestifyApi running on port: %d', port);
      return callback(err, port);
    });
  });
};

module.exports = {
  startServer: startServer
};
