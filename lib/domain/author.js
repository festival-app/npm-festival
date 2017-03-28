'use strict';

class Author {
  constructor(name, organization) {
    this.name = name;
    this.organization = organization;
  }
}

class AuthorBuilder {
  constructor() {
    this.name = null;
    this.organization = null;
  }

  withName(name) {
    this.name = name;
    return this;
  };

  withOrganization(organization) {
    this.organization = organization;
    return this;
  };

  build() {
    return new Author(
      this.name,
      this.organization
    );
  }

}

module.exports = {
  Author: Author,
  AuthorBuilder: AuthorBuilder
};