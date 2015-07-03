var uuid = require('node-uuid');
var moment = require('moment');

var validator = require('../../validator').validator;
var commonBuilders = require('./commonBuilders');

var CategoryBuilder = require('../category').CategoryBuilder;

var festivalsModel = require('festivals-model');
var CategoryBuilderResponse = festivalsModel.model.category.CategoryBuilder;

var buildFestivalCategoryResponse = function buildFestivalCategoryResponse(data) {
  if (!data) {
    return null;
  }

  return new CategoryBuilderResponse()
    .withId(data.id)
    .withName(data.name)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .withParent(data.parent)
    .build();
};

var buildFestivalCategoryDomain = function buildFestivalCategoryDomain(festivalId, params, newObject) {

  var id = undefined;
  var createdAt = undefined;
  var now = moment().toISOString();
  var validate = validator(newObject);

  var name = validate.getString(params.name, 'name');
  var parent = validate.getString(params.parent, 'parent', null);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  var category = new CategoryBuilder()
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
  buildFestivalCategoryResponse: buildFestivalCategoryResponse,
  buildFestivalCategoryDomain: buildFestivalCategoryDomain
};