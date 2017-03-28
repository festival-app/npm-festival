'use strict';

class Category {
  constructor(id, parent, name, festival, createdAt, updatedAt) {
    this.id = id;
    this.parent = parent;
    this.name = name;
    this.festival = festival;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

class CategoryBuilder {
  constructor() {
    this.id = null;
    this.parent = null;
    this.name = null;
    this.festival = null;
    this.createdAt = null;
    this.updatedAt = null;
  }

  withId(id) {
    this.id = id;
    return this;
  };

  withParent(parent) {
    this.parent = parent;
    return this;
  };

  withName(name) {
    this.name = name;
    return this;
  };

  withFestival(festival) {
    this.festival = festival;
    return this;
  };

  withCreatedAt(createdAt) {
    this.createdAt = createdAt;
    return this;
  };

  withUpdatedAt(updatedAt) {
    this.updatedAt = updatedAt;
    return this;
  };

  build() {
    return new Category(
      this.id,
      this.parent,
      this.name,
      this.festival,
      this.createdAt,
      this.updatedAt
    );
  }
}

module.exports = {
  Category: Category,
  CategoryBuilder: CategoryBuilder
};