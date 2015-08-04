var logger = require('../logger/logger').logger;
var options = require('config');
var async = require('async');
var festivalsModel = require('festivals-model').model;
var SearchFestivalsRequestBuilder = festivalsModel.searchFestivalsRequest.SearchFestivalsRequestBuilder;
var extend = require('util')._extend;

var Breadcrumbs = function Breadcrumbs(festivals) {
  this.festivals = festivals;
  this.map = {};
  this.parents = {};
  this.children = {};
};

Breadcrumbs.prototype.getCollection = function getCollection(/*festivalId, callback*/) {
  throw new Error('Must be overrided!');
};

Breadcrumbs.prototype.getFestivalIds = function getFestivalIds(callback) {
  var searchFestivalsRequest = new SearchFestivalsRequestBuilder()
    .withLimit(10000)
    .build();

  this.festivals.getFestivals(searchFestivalsRequest, options, function (err, data) {

    if (err) {
      logger.warn(err);
      return callback(err);
    }

    var ids = data.festivals.map(function (festival) {
      return festival.id;
    });

    return callback(null, ids);
  });
};

Breadcrumbs.prototype.rebuild = function rebuild(callback) {

  var self = this;
  var updateBreadcrumbs = function updateBreadcrumbs(festivalId, callback) {
    self.getCollection(festivalId, function (err, data) {

      if (err) {
        return callback(err);
      }

      if (!self.map.hasOwnProperty(festivalId)) {
        self.map[festivalId] = {};
        self.children[festivalId] = {};
        self.parents[festivalId] = {};
      }

      var dataMap = {};

      data.map(function (elem) {
        dataMap[elem.id] = elem;
      });

      data.map(function (elem) {
        var parentsData = [];
        self.flatParents(dataMap, parentsData, elem.id);

        var childrenData = data.filter(function (subElem) {
          return subElem.parent === elem.id;
        });

        self.map[festivalId][elem.id] = dataMap[elem.id];
        self.children[festivalId][elem.id] = childrenData;
        self.parents[festivalId][elem.id] = parentsData;
      });

      return callback(null, self.map);
    });
  };

  return this.getFestivalIds(function (err, ids) {

    var funcs = ids.map(function (id) {

      return function (callback) {
        return updateBreadcrumbs(id, callback);
      };
    });

    async.series(funcs,
      function (err, results) {
        return callback(null, results);
      });


    //async.map(ids, updateBreadcrumbs, function (err, results) {
    //  return callback(null, results);
    //});

  });
};

Breadcrumbs.prototype.get = function get(festivalId, id) {

  var parents = [];
  var children = [];
  var map = null;

  if (this.parents.hasOwnProperty(festivalId) && this.parents[festivalId].hasOwnProperty(id)) {
    parents = this.parents[festivalId][id];
  }

  if (this.children.hasOwnProperty(festivalId) && this.children[festivalId].hasOwnProperty(id)) {
    children = this.children[festivalId][id];
  }

  if (this.map.hasOwnProperty(festivalId) && this.map[festivalId].hasOwnProperty(id)) {
    map = this.map[festivalId][id];
  }

  if (parents.length && children.length && map) {
    return extend(
      {
        parents: parents,
        children: children
      },
      map
    );
  }

  return null;
};

Breadcrumbs.prototype.flatParents = function flatParents(dataMap, parents, id) {
  if (!dataMap.hasOwnProperty(id)) {
    logger.warn('dataMap don\'t have id:', id);
    return;
  }

  if (!dataMap[id].hasOwnProperty('parent')) {
    logger.warn('dataMap[' + id + '] don\'t have parent property:', dataMap[id]);
    return;
  }

  if (dataMap[id].parent) {
    parents.push(dataMap[dataMap[id].parent]);
    flatParents(dataMap, parents, dataMap[id].parent);
  }
};


module.exports = {
  Breadcrumbs: Breadcrumbs
};