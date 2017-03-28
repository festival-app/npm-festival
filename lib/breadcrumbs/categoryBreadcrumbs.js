'use strict';

const logger = require('../logger/logger').logger;
const options = require('config');
const festivalsModel = require('festivals-model').model;
const SearchFestivalCategoriesRequestBuilder = festivalsModel.searchFestivalCategoriesRequest.SearchFestivalCategoriesRequestBuilder;
const Breadcrumbs = require('./breadcrumbs').Breadcrumbs;

class CategoryBreadcrumbs extends Breadcrumbs {
  constructor(festivals) {
    super(festivals);
  }

  //
  //CategoryBreadcrumbs.prototype.getElement = function getCollection(festivalId, id, callback) {
  //  this.festivals.getFestivalPlace(festivalId, id, {}, callback);
  //};

  getCollection(festivalId, callback) {
    const search = new SearchFestivalCategoriesRequestBuilder()
      .withLimit(10000)
      .build();

    this.festivals.getFestivalCategories(festivalId, search, options, (err, data) => {

      if (err) {
        logger.warn('CategoryBreadcrumbs.getFestivalCategories', err);
        return callback(err);
      }

      return callback(null, data.categories);
    });
  }
}

CategoryBreadcrumbs.prototype.constructor = Breadcrumbs;


module.exports = {
  CategoryBreadcrumbs: CategoryBreadcrumbs
};