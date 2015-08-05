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
  throw new Error('Must be override!');
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

Breadcrumbs.prototype.updateBreadcrumbsForFestival = function updateBreadcrumbsForFestival(festivalId, callback) {
  var self = this;

  self.getCollection(festivalId, function (err, data) {

    if (err) {
      return callback(err);
    }

    if (!self.map.hasOwnProperty(festivalId)) {
      self.map[festivalId] = {};
      self.children[festivalId] = {};
      self.parents[festivalId] = {};
    }

    //at first add all (for flatParents)
    data.map(function (elem) {
      self.map[festivalId][elem.id] = elem;
    });

    data.map(function (elem) {
      self.updateBreadcrumbs(festivalId, elem);
    });

    return callback(null, self.map[festivalId]);
  });
};

Breadcrumbs.prototype.updateBreadcrumbs = function updateBreadcrumbs(festivalId, elem) {
  var self = this;

  if (!self.map.hasOwnProperty(festivalId)) {
    logger.warn('updateBreadcrumbs failed for festival id: ', festivalId);
    return;
  }

  //add to collection
  self.map[festivalId][elem.id] = elem;

  for (var id in self.map[festivalId]) {
    if (self.map[festivalId].hasOwnProperty(id)) {

      var parentsData = [];
      var childrenData = [];
      self.flatParents(self.map[festivalId], parentsData, id);

      for (var idd in self.map[festivalId]) {
        if (self.map[festivalId].hasOwnProperty(idd)) {
          var subElem = self.map[festivalId][idd];

          if (subElem.parent === id) {
            childrenData.push(subElem);
          }
        }
      }

      self.children[festivalId][id] = childrenData;
      self.parents[festivalId][id] = parentsData;
    }
  }
};

Breadcrumbs.prototype.rebuild = function rebuild(callback) {
  var self = this;

  return this.getFestivalIds(function (err, ids) {

    var funcs = ids.map(function (id) {

      return function (callback) {
        return self.updateBreadcrumbsForFestival(id, callback);
      };
    });

    async.series(funcs,
      function (err, results) {
        return callback(null, results);
      });


    //async.map(ids, updateBreadcrumbsForFestival, function (err, results) {
    //  return callback(null, results);
    //});

  });
};

Breadcrumbs.prototype.get = function get(festivalId, id) {

  var parents = [];
  var children = [];
  var map = {id: id};

  //console.log('this.parents');
  //console.dir(this.parents, {depth: null});
  //console.log('this.children');
  //console.dir(this.children, {depth: null});

  if (this.parents.hasOwnProperty(festivalId) && this.parents[festivalId].hasOwnProperty(id)) {
    parents = this.parents[festivalId][id];
  }

  if (this.children.hasOwnProperty(festivalId) && this.children[festivalId].hasOwnProperty(id)) {
    children = this.children[festivalId][id];
  }

  if (this.map.hasOwnProperty(festivalId) && this.map[festivalId].hasOwnProperty(id)) {
    map = this.map[festivalId][id];
  }

  return extend(
    {
      parents: parents,
      children: children
    },
    map
  );
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