'use strict';

const uuid = require('uuid');
const moment = require('moment');

const validator = require('../../validator').validator;
const commonBuilders = require('./commonBuilders');

const CategoryDomainBuilder = require('../category').CategoryBuilder;

const festivalsModel = require('festivals-model');
const CategoryResponseBuilder = festivalsModel.model.categoryResponse.CategoryResponseBuilder;

const buildCategoryResponse = function buildCategoryResponse(data) {
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

const buildCategoryDomain = function buildCategoryDomain(festivalId, params, newObject) {

  let id;
  let createdAt;
  const now = moment().toISOString();
  const validate = validator(newObject);

  const name = validate.getString(params.name, 'name');
  const parent = validate.getString(params.parent, 'parent', null);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  const category = new CategoryDomainBuilder()
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