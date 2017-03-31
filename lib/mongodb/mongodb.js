'use strict';

const logger = require('../logger/logger').logger;
const mongodb = require('mongodb');
const u = require('mongo-uuid');

module.exports.db = function db(MongoClient, url) {

  let db;

  MongoClient.connect(url, function (err, connection) {
    logger.info('Connected successfully to mongo server: %s', url);

    db = connection;
  });

  const create = function create(doc, collectionName, callback) {
    logger.debug('create in mongodb collection: %s with id: %s', collectionName, doc.id);

    doc._id = u.parse(doc.id);
    delete doc.id;  //remove duplicate

    const collection = db.collection(collectionName);
    collection.insertOne(doc, function (err, result) {
      logger.debug('mongo create response: %s, %s', err, result);

      //restore
      doc.id = u.stringify(doc._id);
      return callback(err, result);
    });
  };

  const update = function update(id, doc, collectionName, callback) {
    logger.debug('update in mongodb: %s', id);

    const collection = db.collection(collectionName);
    collection.findOneAndUpdate({_id: u.parse(id)}, {$set: doc}, function (err, {value}) {
      logger.debug('mongodb update response: %s, %s', err, value);

      value.id = u.stringify(value._id);
      delete value._id;

      return callback(err, value);
    });
  };

  const get = function get(id, collectionName, callback) {
    logger.debug('get data from mongodb: %s', id);

    const collection = db.collection(collectionName);
    collection.findOne({_id: u.parse(id)}, function (err, result) {
      logger.debug('mongo get response: %s', result, err);

      result.id = u.stringify(result._id);
      delete result._id;

      return callback(err, result);
    });
  };

  const remove = function remove(id, collectionName, callback) {
    logger.debug('remove data from mongodb: %s', id);

    const collection = db.collection(collectionName);
    collection.deleteOne({_id: u.parse(id)}, function (err, result) {
      logger.debug('mongodb delete: %s, %s', err, result);

      result.id = u.stringify(result._id);
      delete result._id;

      return callback(err, result);
    });
  };

  const search = function search(query, collectionName, callback) {
    logger.debug('search data to mongodb: %s', query);

    const collection = db.collection(collectionName);
    collection.find(query).toArray(function (err, docs) {
      logger.debug('mongodb search: %s, %s', err, docs);

      return callback(err, docs.map((doc) => {
        doc.id = u.stringify(doc._id);
        delete doc._id;
        return doc;
      }));
    });

  };

  return {
    create: create,
    update: update,
    get: get,
    remove: remove,
    search: search
  };
};
