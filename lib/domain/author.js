'use strict';

var Author = function Author(name, organization) {
  this.name = name;
  this.organization = organization;
};

var AuthorBuilder = function AuthorBuilder() {
  this.name = null;
  this.organization = null;

  var _this = this;

  this.withName = function (name) {
    _this.name = name;
    return _this;
  };

  this.withOrganization = function (organization) {
    _this.organization = organization;
    return _this;
  };

  this.build = function () {
    return new Author(
      _this.name,
      _this.organization
    );
  };

};

module.exports = {
  Author: Author,
  AuthorBuilder: AuthorBuilder
};