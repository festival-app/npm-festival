'use strict';

var logger = require('../logger/logger').logger;
var options = require('config');
var festivalsModel = require('festivals-model').model;
var SearchFestivalPlacesRequestBuilder = festivalsModel.searchFestivalPlacesRequest.SearchFestivalPlacesRequestBuilder;
var Breadcrumbs = require('./breadcrumbs').Breadcrumbs;

var PlaceBreadcrumbs = function PlaceBreadcrumbs(festivals) {
  Breadcrumbs.call(this, festivals);
};

PlaceBreadcrumbs.prototype = Object.create(Breadcrumbs.prototype);

//PlaceBreadcrumbs.prototype.getElement = function getCollection(festivalId, id, callback) {
//  this.festivals.createFestivalPlace(festivalId, id, {}, callback);
//};

PlaceBreadcrumbs.prototype.getCollection = function getCollection(festivalId, callback) {
    var search = new SearchFestivalPlacesRequestBuilder()
    .withLimit(10000)
    .build();

  this.festivals.getFestivalPlaces(festivalId, search, options, function (err, data) {

    if (err) {
      logger.warn('PlaceBreadcrumbs.getFestivalCategories', err);
      return callback(err);
    }

    return callback(null, data.places);
  });
};

PlaceBreadcrumbs.prototype.constructor = Breadcrumbs;


module.exports = {
  PlaceBreadcrumbs: PlaceBreadcrumbs
};