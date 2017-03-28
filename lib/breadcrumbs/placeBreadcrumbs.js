'use strict';

const logger = require('../logger/logger').logger;
const options = require('config');
const festivalsModel = require('festivals-model').model;
const SearchFestivalPlacesRequestBuilder = festivalsModel.searchFestivalPlacesRequest.SearchFestivalPlacesRequestBuilder;
const Breadcrumbs = require('./breadcrumbs').Breadcrumbs;

class PlaceBreadcrumbs extends Breadcrumbs {
  constructor(festivals) {
    super(festivals);
  }

  //PlaceBreadcrumbs.prototype.getElement = function getCollection(festivalId, id, callback) {
  //  this.festivals.createFestivalPlace(festivalId, id, {}, callback);
  //};

  getCollection(festivalId, callback) {
      const search = new SearchFestivalPlacesRequestBuilder()
      .withLimit(10000)
      .build();

    this.festivals.getFestivalPlaces(festivalId, search, options, (err, data) => {

      if (err) {
        logger.warn('PlaceBreadcrumbs.getFestivalCategories', err);
        return callback(err);
      }

      return callback(null, data.places);
    });
  }
}

PlaceBreadcrumbs.prototype.constructor = Breadcrumbs;


module.exports = {
  PlaceBreadcrumbs: PlaceBreadcrumbs
};