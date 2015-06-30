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
    //level: 'trace'
  };

  connection = new elasticsearchClient(esConfig);

  //updateMappings(
  //  config.elasticsearch.index,
  //  config.elasticsearch.categories.type,
  //  config.elasticsearch.categories.mappings
  //);
  //
  //updateMappings(
  //  config.elasticsearch.index,
  //  config.elasticsearch.festivals.type,
  //  config.elasticsearch.festivals.mappings
  //);
  //
  //updateMappings(
  //  config.elasticsearch.index,
  //  config.elasticsearch.events.type,
  //  config.elasticsearch.events.mappings
  //);
  //
  //updateMappings(
  //  config.elasticsearch.index,
  //  config.elasticsearch.places.type,
  //  config.elasticsearch.places.mappings
  //);


  //connection.indices.create({
  //    index: config.elasticsearch.index
  //  },
  //  function (error, response) {
  //    console.log('es: indices create: ', error, response);
  //  }
  //);

  //
  //connection.indices.getMapping({
  //    index: config.elasticsearch.index,
  //    type: config.elasticsearch.festivals.type
  //  },
  //  function (error, response) {
  //    console.log('es: indices putMapping: ', error, response);
  //  }
  //);
};

var connect = function connect() {
  if (!connection) {
    init();
  }

  return connection;
};

var updateMappings = function updateMappings(index, type, mapping) {

  connection.indices.deleteMapping({
      index: index,
      type: type
    },
    function (error, response) {
      console.log('es: deleteMapping: ', error, response);

      connection.indices.putMapping({
          index: index,
          type: type,
          body: mapping
        },
        function (error, response) {
          console.log('es: indices putMapping: ', error, response);

          connection.indices.getMapping({
              index: index,
              type: type
            },
            function (error, response) {
              console.log('es: indices getMapping: ', error, response);
            }
          );

        }
      );
    });
};

module.exports = {
  connect: connect
};

