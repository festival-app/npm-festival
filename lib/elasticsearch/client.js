var config = require('config');
var elasticsearch = require('elasticsearch');
var extend = require('util')._extend;

var connect = function connect() {
  var esConfig = extend(config.provider.elasticsearch, {"__reused": false});

  //console.log(esConfig);
  //console.log(elasticsearch);
  //console.log(elasticsearch.Client);

  var client = new elasticsearch.Client(esConfig);

  client.indices.create({
      index: config.elasticsearch.index
    },
    function (error, response) {
      console.log('es: indices create: ', error, response);
    }
  );

//  client.indices.deleteMapping({
//      index: esConfig.index,
//      type: esConfig.type
//    },
//    function (error, response) {
//      console.log('es: deleteMapping: ', error, response);
//    });


//  client.indices.getMapping({
//      index: esConfig.index,
//      type: esConfig.type
//    },
//    function (error, response) {
//      console.log('es: indices putMapping: ', error, response);
//    }
//  );

  //client.indices.putMapping({
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

//  client.cat.plugins({}, function (error, response) {
//    console.log('es: plugins: ', error, response);
//  });

  return client;
};

module.exports = {
  connect: connect
};

