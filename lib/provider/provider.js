'use strict';

const config = require('config');

let provider = null;

const getProvider = function getProvider() {

  if (!provider) {
    switch (config.provider.selected) {
      case 'elasticsearch':
        const esClient = require('../elasticsearch/client').connect();
        const es = require('../elasticsearch/es').es(esClient);
        provider = require('./elasticsearchProvider').provider(es, config);
        break;
      case 'mongodb':
        const MongoClient = require('mongodb').MongoClient;
        const mongodb = require('../mongodb/mongodb').db(MongoClient, config.provider.mongodb.url);

        // Use connect method to connect to the server
        provider = require('./mongodbProvider').provider(mongodb, config);

        break;
      case 'fireabase':
        const firebase = require('firebase-admin');

        firebase.initializeApp({
          credential: firebase.credential.cert(config.provider.firebase.credential),
          databaseURL: config.provider.firebase.url
        });

        const db = firebase.database();
        provider = require('./fireabaseProvider').provider(db);
        break;
      default :
        throw Error(`Unknown provider: ${config.provider.selected}`);
    }
  }

  return provider;
};

module.exports = {
  getProvider: getProvider
};