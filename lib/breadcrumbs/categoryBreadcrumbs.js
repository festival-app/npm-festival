var logger = require('../logger/logger').logger;
var options = require('config');
var festivalsModel = require('festivals-model').model;
var SearchFestivalCategoriesRequestBuilder = festivalsModel.searchFestivalCategoriesRequest.SearchFestivalCategoriesRequestBuilder;
var Breadcrumbs = require('./breadcrumbs').Breadcrumbs;

var CategoryBreadcrumbs = function CategoryBreadcrumbs(festivals) {
  Breadcrumbs.call(this, festivals);
};

CategoryBreadcrumbs.prototype = Object.create(Breadcrumbs.prototype);
//
//CategoryBreadcrumbs.prototype.getElement = function getCollection(festivalId, id, callback) {
//  this.festivals.getFestivalPlace(festivalId, id, {}, callback);
//};

CategoryBreadcrumbs.prototype.getCollection = function getCollection(festivalId, callback) {
  var search = new SearchFestivalCategoriesRequestBuilder()
    .withLimit(10000)
    .build();

  this.festivals.getFestivalCategories(festivalId, search, options, function (err, data) {

    if (err) {
      logger.warn(err);
      return callback(err);
    }

    return callback(null, data.categories);
  });
};

CategoryBreadcrumbs.prototype.constructor = Breadcrumbs;


module.exports = {
  CategoryBreadcrumbs: CategoryBreadcrumbs
};