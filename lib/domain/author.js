var Author = function Author(name, organization) {
  this.name = name;
  this.organization = organization;
};

var AuthorBuilder = function AuthorBuilder() {
  this.name = null;
  this.organization = null;

  var self = this;

  this.withName = function (name) {
    self.name = name;
    return self;
  };

  this.withOrganization = function (organization) {
    self.organization = organization;
    return self;
  };

  this.build = function () {
    return new Author(
      self.name,
      self.organization
    );
  };

};

module.exports = exports = {
  Author: Author,
  AuthorBuilder: AuthorBuilder
};