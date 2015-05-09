var fs = require('fs');
var myRestifyApi = require('my-restify-api');
//var UnauthorizedError = myRestifyApi.error.UnauthorizedError;
var oauth = myRestifyApi.plugin.oauth;
var festivalsController = require('./controller/festivals');
var eventsController = require('./controller/events');
var logger = require('./logger/logger').logger;

var FESTIVALS_PATH = '/api/festivals';
var FESTIVALS_ID_PATH = FESTIVALS_PATH + '/:id';
var FESTIVALS_EVENTS_PATH = FESTIVALS_ID_PATH + '/events';
var FESTIVALS_EVENTS_ID_PATH = FESTIVALS_EVENTS_PATH + '/:eid';
var FESTIVALS_PLACES_PATH = FESTIVALS_ID_PATH + '/places';
var FESTIVALS_PLACES_ID_PATH = FESTIVALS_PLACES_PATH + '/:pid';
var FESTIVALS_CATEGORIES_PATH = FESTIVALS_ID_PATH + '/categories';
var FESTIVALS_CATEGORIES_ID_PATH = FESTIVALS_CATEGORIES_PATH + '/:cid';
var FESTIVALS_TAGS_PATH = FESTIVALS_ID_PATH + '/tags';
var FESTIVALS_TAGS_ID_PATH = FESTIVALS_TAGS_PATH + '/:tid';

var startServer = function startServer(callback) {
  fs.readFile('config/public.key', function (err, data) {
    if (err) {
      logger.debug('config/public.key read error: ', err);
      throw err;
    }

    var options = {
      appName: 'API',
      swagger: {
        enabled: true,
        apiDocsDir: __dirname + '/public/'
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
        class: 'NotFoundError'
      },
      EventPlaceNotFound: {
        class: 'NotFoundError'
      },
      FestivalNotFound: {
        class: 'NotFoundError'
      },
      ServiceUnavailable: {
        class: 'ServiceUnavailableError'
      }
    };

    var cacheHandler = function (req, res, next) {
      res.cache('public', {maxAge: 600});
      res.header('Vary', 'Accept-Language, Accept-Encoding, Accept, Content-Type');
//    res.header('Last-Modified', new Date());
      return next();
    };

    var noCacheHandler = function (req, res, next) {
      res.cache('private');
      return next();
    };

    var authPublicHandler = function (req, res, next) {
      //try {
      //  oauth(req)
      //    .scope('openid')
      //    .client('vehiclehistory')
      //    .user();
      //}
      //catch (e) {
      //  return next(new UnauthorizedError('Unauthorized error: ' + e.message));
      //}

      return next();
    };

    var authFestivalsWriteHandler = function (req, res, next) {
      //try {
      //  oauth(req)
      //    .scope('openid')
      //    .client('vehiclehistory')
      //    .user();
      //}
      //catch (e) {
      //  return next(new UnauthorizedError('Unauthorized error: ' + e.message));
      //}

      return next();
    };

    var authFestivalEventsWriteHandler = function (req, res, next) {
      //try {
      //  oauth(req)
      //    .scope('openid')
      //    .client('vehiclehistory')
      //    .user();
      //}
      //catch (e) {
      //  return next(new UnauthorizedError('Unauthorized error: ' + e.message));
      //}

      return next();
    };

    var routes = {
      'get': [
        {
          options: {
            path: FESTIVALS_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: festivalsController.getFestivalsV1
        },
        {
          options: {
            path: FESTIVALS_ID_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: festivalsController.getFestivalV1
        },
        {
          options: {
            path: FESTIVALS_EVENTS_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: eventsController.getFestivalEventsV1
        },
        {
          options: {
            path: FESTIVALS_EVENTS_ID_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: eventsController.getFestivalEventV1
        },
        {
          options: {
            path: FESTIVALS_PLACES_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: eventsController.getFestivalEventsV1
        },
        {
          options: {
            path: FESTIVALS_PLACES_ID_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: eventsController.getFestivalEventV1
        },
        {
          options: {
            path: FESTIVALS_CATEGORIES_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: eventsController.getFestivalEventsV1
        },
        {
          options: {
            path: FESTIVALS_CATEGORIES_ID_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: eventsController.getFestivalEventV1
        },
        {
          options: {
            path: FESTIVALS_TAGS_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: eventsController.getFestivalEventsV1
        },
        {
          options: {
            path: FESTIVALS_TAGS_ID_PATH, version: '1.0.0'
          },
          authMethod: authPublicHandler,
          cache: cacheHandler,
          controllerMethod: eventsController.getFestivalEventV1
        }
      ],
      'post': [
        {
          options: {
            path: FESTIVALS_PATH, version: '1.0.0'
          },
          authMethod: authFestivalsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: festivalsController.createFestivalV1
        },
        {
          options: {
            path: FESTIVALS_EVENTS_PATH, version: '1.0.0'
          },
          authMethod: authFestivalEventsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: eventsController.createFestivalEventV1
        },
        {
          options: {
            path: FESTIVALS_PLACES_PATH, version: '1.0.0'
          },
          authMethod: authFestivalEventsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: eventsController.getFestivalEventsV1
        },
        {
          options: {
            path: FESTIVALS_CATEGORIES_PATH, version: '1.0.0'
          },
          authMethod: authFestivalEventsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: eventsController.getFestivalEventsV1
        },
        {
          options: {
            path: FESTIVALS_TAGS_PATH, version: '1.0.0'
          },
          authMethod: authFestivalEventsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: eventsController.getFestivalEventsV1
        }
      ],
      'put': [
        {
          options: {
            path: FESTIVALS_ID_PATH, version: '1.0.0'
          },
          authMethod: authFestivalsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: festivalsController.updateFestivalV1
        },
        {
          options: {
            path: FESTIVALS_EVENTS_ID_PATH, version: '1.0.0'
          },
          authMethod: authFestivalEventsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: eventsController.getFestivalEventV1
        },
        {
          options: {
            path: FESTIVALS_PLACES_ID_PATH, version: '1.0.0'
          },
          authMethod: authFestivalEventsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: eventsController.getFestivalEventV1
        },
        {
          options: {
            path: FESTIVALS_CATEGORIES_ID_PATH, version: '1.0.0'
          },
          authMethod: authFestivalEventsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: eventsController.getFestivalEventV1
        },
        {
          options: {
            path: FESTIVALS_TAGS_ID_PATH, version: '1.0.0'
          },
          authMethod: authFestivalEventsWriteHandler,
          cache: noCacheHandler,
          controllerMethod: eventsController.getFestivalEventV1
        }
      ]
    };

    myRestifyApi.runServer(routes, errorHandlers, options, function (err, port) {
      logger.debug('myRestifyApi running on port: %d', port);
      return callback(err, port);
    });
  });
};

module.exports = {
  startServer: startServer
};