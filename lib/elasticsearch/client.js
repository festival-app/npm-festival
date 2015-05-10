var logger = require('../logger/logger').logger;
var config = require('config');
var elasticsearchClient = require('elasticsearch').Client;
var extend = require('util')._extend;

var connection = null;

var init = function init() {

  var es = config.provider.get('elasticsearch');
  var esConfig = extend(es, {'__reused': false});
  esConfig.log = {
    type: 'stdio',
    level: logger.level
  };

  connection = new elasticsearchClient(esConfig);

  //connection.indices.create({
  //    index: config.elasticsearch.index
  //  },
  //  function (error, response) {
  //    console.log('es: indices create: ', error, response);
  //  }
  //);

//  connection.indices.deleteMapping({
//      index: esConfig.index,
//      type: esConfig.type
//    },
//    function (error, response) {
//      console.log('es: deleteMapping: ', error, response);
//    });


//  connection.indices.getMapping({
//      index: esConfig.index,
//      type: esConfig.type
//    },
//    function (error, response) {
//      console.log('es: indices putMapping: ', error, response);
//    }
//  );

  //connection.indices.putMapping({
  //    index: esConfig.index,
  //    type: esConfig.type,
  //    body: {
  //      "position": {
  //        "properties": {
  //          "positions": {
  //            "properties": {
  //              "location": {
  //                "type": "geo_point"
  //              }
  //            },
  //            "user": {
  //              "type": "string"
  //            }
  //          }
  //        }
  //      }
  //    }
  //  },
  //  function (error, response) {
  //    console.log('es: indices putMapping: ', error, response);
  //  }
  //);

//  connection.cat.plugins({}, function (error, response) {
//    console.log('es: plugins: ', error, response);
//  });
};

var connect = function connect() {
  if (!connection) {
    init();
  }

  return connection;
};

module.exports = {
  connect: connect
};

