var uuid = require('node-uuid');
var moment = require('moment');

var validator = require('../../validator').validator;
var commonBuilders = require('./commonBuilders');

var NewsDomainBuilder = require('../news').NewsBuilder;

var festivalsModel = require('festivals-model');
var NewsResponseBuilder = festivalsModel.model.newsResponse.NewsResponseBuilder;
const MAIN_NEWS_NAME = 'MAIN';


var buildNewsResponse = function buildNewsResponse(data) {
  if (!data) {
    return null;
  }

  var mainImage = commonBuilders.buildMainImageResponse(data.images);
  var authors = commonBuilders.buildAuthorResponse(data.authors);

  return new NewsResponseBuilder()
    .withId(data.id)
    .withName(data.name)
    .withDescription(data.description)
    .withMainImage(mainImage)
    .withAuthors(authors)
    .withTags(data.tags)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .build();
};

var buildNewsDomain = function buildNewsDomain(festivalId, params, newObject) {

  var id;
  var createdAt;
  var now = moment().toISOString();
  var validate = validator(newObject);

  festivalId = festivalId || MAIN_NEWS_NAME;
  var name = validate.getString(params.name, 'name');
  var description = validate.getString(params.description, 'description');
  var tags = validate.getArrayOfString(params.tags, 'tags', []);
  var authors = commonBuilders.buildAuthorDomain(params.authors);
  var images = commonBuilders.buildImagesDomain(validate, params);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  var news = new NewsDomainBuilder()
    .withId(id)
    .withName(name)
    .withDescription(description)
    .withImages(images)
    .withAuthors(authors)
    .withTags(tags)
    .withFestival(festivalId)
    .withCreatedAt(createdAt)
    .withUpdatedAt(now)
    .build();

  commonBuilders.removeUndefined(news);
  return news;
};

module.exports = {
  buildNewsResponse: buildNewsResponse,
  buildNewsDomain: buildNewsDomain
};