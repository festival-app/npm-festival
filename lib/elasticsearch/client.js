'use strict';

const logger = require('../logger/logger').logger;
const config = require('config');
const elasticsearchClient = require('elasticsearch').Client;
const extend = require('util')._extend;

let connection = null;

const updateMappings = function updateMappings(index, type, mapping, callback) {

  connection.indices.deleteMapping({
      index: index,
      type: type
    },
    (errorDelete, responseDelete) => {
      console.log('es: deleteMapping: ', errorDelete, responseDelete);

      connection.indices.create({
          index: index,
          type: type
        },
        (errorCreate, responseCreate) => {
          console.log('es: create: ', errorCreate, responseCreate);

          connection.indices.putMapping({
              index: index,
              type: type,
              body: mapping
            },
            (errorPut, responsePut) => {
              console.log('es: indices putMapping: ', errorPut, responsePut);

              connection.indices.getMapping({
                  index: index,
                  type: type
                },
                (error, response) => {
                  console.log('es: indices getMapping: ', error, response);
                  return callback(error, response);
                }
              );

            }
          );
        });
    });
};

const init = function init() {

  const es = config.provider.get('elasticsearch');
  const esConfig = extend(es, {'__reused': false});
  esConfig.log = {
    type: 'stdio',
    level: logger.level
    //level: 'trace'
  };

  connection = new elasticsearchClient(esConfig);

  if (false) {
    updateMappings(
      config.elasticsearch.events.index,
      config.elasticsearch.events.type,
      config.elasticsearch.events.mappings,
      () => /*err, res*/{

        updateMappings(
          config.elasticsearch.festivals.index,
          config.elasticsearch.festivals.type,
          config.elasticsearch.festivals.mappings,
          () => /*err, res*/{

            updateMappings(
              config.elasticsearch.categories.index,
              config.elasticsearch.categories.type,
              config.elasticsearch.categories.mappings,
              () => /*err, res*/{

                updateMappings(
                  config.elasticsearch.places.index,
                  config.elasticsearch.places.type,
                  config.elasticsearch.places.mappings,
                  () => /*err, res*/{

                    updateMappings(
                      config.elasticsearch.news.index,
                      config.elasticsearch.news.type,
                      config.elasticsearch.news.mappings,
                      () => /*err, res*/{
                        console.log('updateMappings done!');
                      });
                  });
              });
          });
      });
  }

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

const connect = function connect() {
  if (!connection) {
    init();
  }

  return connection;
};

module.exports = {
  connect: connect
};

