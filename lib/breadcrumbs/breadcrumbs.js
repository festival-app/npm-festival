'use strict';

const logger = require('../logger/logger').logger;
const options = require('config');
const async = require('async');
const festivalsModel = require('festivals-model').model;
const SearchFestivalsRequestBuilder = festivalsModel.searchFestivalsRequest.SearchFestivalsRequestBuilder;
const extend = require('util')._extend;

class Breadcrumbs {
  constructor(festivals) {
    this.festivals = festivals;
    this.map = {};
    this.parents = {};
    this.children = {};
  }

  getCollection() {
    throw new Error('Must be override!');
  }

  getFestivalIds(callback) {
    const searchFestivalsRequest = new SearchFestivalsRequestBuilder()
      .withLimit(10000)
      .build();

    this.festivals.getFestivals(searchFestivalsRequest, options, (err, {festivals}) => {

      if (err) {
        logger.warn('Breadcrumbs.getFestivals', err);
        return callback(err);
      }

      const ids = festivals.map(({id}) => id);

      return callback(null, ids);
    });
  }

  updateBreadcrumbsForFestival(festivalId, callback) {
    const self = this;

    self.getCollection(festivalId, (err, data) => {

      if (err) {
        return callback(err);
      }

      if (!self.map.hasOwnProperty(festivalId)) {
        self.map[festivalId] = {};
        self.children[festivalId] = {};
        self.parents[festivalId] = {};
      }

      //at first add all (for flatParents)
      data.map(elem => {
        self.map[festivalId][elem.id] = elem;
      });

      data.map(elem => {
        self.updateBreadcrumbs(festivalId, elem);
      });

      return callback(null, self.map[festivalId]);
    });
  }

  updateBreadcrumbs(festivalId, elem) {
    const self = this;

    if (!self.map.hasOwnProperty(festivalId)) {
      logger.warn('updateBreadcrumbs failed for festival id: ', festivalId);
      return;
    }

    //add to collection
    self.map[festivalId][elem.id] = elem;

    for (const id in self.map[festivalId]) {
      if (self.map[festivalId].hasOwnProperty(id)) {

        const parentsData = [];
        const childrenData = [];
        self.flatParents(self.map[festivalId], parentsData, id);

        for (const idd in self.map[festivalId]) {
          if (self.map[festivalId].hasOwnProperty(idd)) {
            const subElem = self.map[festivalId][idd];

            if (subElem.parent === id) {
              childrenData.push(subElem);
            }
          }
        }

        self.children[festivalId][id] = childrenData;
        self.parents[festivalId][id] = parentsData;
      }
    }
  }

  rebuild(callback) {
    const self = this;

    return this.getFestivalIds((err, ids) => {

      if (err) {
        return callback(err);
      }

      const funcs = ids.map(id => cb => self.updateBreadcrumbsForFestival(id, cb));

      return async.series(funcs, callback);

      //async.map(ids, updateBreadcrumbsForFestival,callback);

    });
  }

  get(festivalId, id) {

    let parents = [];
    let children = [];
    let map = {id: id};

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
  }

  flatParents(dataMap, parents, id) {
    if (!dataMap.hasOwnProperty(id)) {
      logger.warn('dataMap don\'t have id:', id);
      return;
    }

    if (!dataMap[id].hasOwnProperty('parent')) {
      logger.warn(`dataMap[${id}] don't have parent property:`, dataMap[id]);
      return;
    }

    if (dataMap[id].parent) {
      parents.push(dataMap[dataMap[id].parent]);
      this.flatParents(dataMap, parents, dataMap[id].parent);
    }
  }
}


module.exports = {
  Breadcrumbs: Breadcrumbs
};