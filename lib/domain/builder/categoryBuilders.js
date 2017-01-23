'use strict';

var uuid = require('uuid');
var moment = require('moment');

var validator = require('../../validator').validator;
var commonBuilders = require('./commonBuilders');

var CategoryDomainBuilder = require('../category').CategoryBuilder;

var festivalsModel = require('festivals-model');
var CategoryResponseBuilder = festivalsModel.model.categoryResponse.CategoryResponseBuilder;

var buildCategoryResponse = function buildCategoryResponse(data) {
  if (!data) {
    return null;
  }

  return new CategoryResponseBuilder()
    .withId(data.id)
    .withName(data.name)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .withParent(data.parent)
    .build();
};

var buildCategoryDomain = function buildCategoryDomain(festivalId, params, newObject) {

  var id;
  var createdAt;
  var now = moment().toISOString();
  var validate = validator(newObject);

  var name = validate.getString(params.name, 'name');
  var parent = validate.getString(params.parent, 'parent', null);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  var category = new CategoryDomainBuilder()
    .withId(id)
    .withParent(parent)
    .withName(name)
    .withFestival(festivalId)
    .withCreatedAt(createdAt)
    .withUpdatedAt(now)
    .build();

  commonBuilders.removeUndefined(category);
  return category;
};

module.exports = {
  buildCategoryResponse: buildCategoryResponse,
  buildCategoryDomain: buildCategoryDomain
};