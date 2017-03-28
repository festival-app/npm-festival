'use strict';

const uuid = require('uuid');
const moment = require('moment');

const validator = require('../../validator').validator;
const commonBuilders = require('./commonBuilders');

const NewsDomainBuilder = require('../news').NewsBuilder;

const festivalsModel = require('festivals-model');
const NewsResponseBuilder = festivalsModel.model.newsResponse.NewsResponseBuilder;
const NewsStatusEnum = festivalsModel.model.newsStatusEnum.NewsStatusEnum;
const MAIN_NEWS_NAME = 'MAIN';

const buildNewsResponse = function buildNewsResponse(data) {
  if (!data) {
    return null;
  }

  const mainImage = commonBuilders.buildMainImageResponse(data.images);
  const authors = commonBuilders.buildAuthorResponse(data.authors);

  return new NewsResponseBuilder()
    .withId(data.id)
    .withName(data.name)
    .withDescription(data.description)
    .withStatus(data.status)
    .withMainImage(mainImage)
    .withAuthors(authors)
    .withTags(data.tags)
    .withPublishedAt(data.publishedAt)
    .withCreatedAt(data.createdAt)
    .withUpdatedAt(data.updatedAt)
    .build();
};

const buildNewsDomain = function buildNewsDomain(festivalId, params, newObject) {

  let id;
  let createdAt;
  const now = moment().toISOString();
  const validate = validator(newObject);

  festivalId = festivalId || MAIN_NEWS_NAME;
  const name = validate.getString(params.name, 'name');
  const description = validate.getString(params.description, 'description');
  const status = validate.getEnum(NewsStatusEnum.getStatus(params.status), 'status', NewsStatusEnum.CREATED);
  const tags = validate.getArrayOfString(params.tags, 'tags', []);
  const authors = commonBuilders.buildAuthorDomain(params.authors);
  const images = commonBuilders.buildImagesDomain(validate, params);
  let publishedAt = validate.getString(params.publishedAt, 'publishedAt', null);

  if (newObject) {
    id = uuid.v4();
    createdAt = now;
  }

  if (publishedAt) {
    publishedAt = moment(publishedAt).toISOString();
  }

  const news = new NewsDomainBuilder()
    .withId(id)
    .withName(name)
    .withDescription(description)
    .withStatus(status)
    .withImages(images)
    .withAuthors(authors)
    .withTags(tags)
    .withFestival(festivalId)
    .withPublishedAt(publishedAt)
    .withCreatedAt(createdAt)
    .withUpdatedAt(createdAt)
    .build();

  commonBuilders.removeUndefined(news);
  return news;
};

module.exports = {
  buildNewsResponse: buildNewsResponse,
  buildNewsDomain: buildNewsDomain,
  MAIN_NEWS_NAME: MAIN_NEWS_NAME
};