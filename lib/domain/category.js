var Category = function Category(id, parent, name, festival, createdAt, updatedAt) {
  this.id = id;
  this.parent = parent;
  this.name = name;
  this.festival = festival;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
};

var CategoryBuilder = function CategoryBuilder() {
  this.id = null;
  this.parent = null;
  this.name = null;
  this.festival = null;
  this.createdAt = null;
  this.updatedAt = null;

  var self = this;

  this.withId = function (id) {
    self.id = id;
    return self;
  };

  this.withParent = function (parent) {
    self.parent = parent;
    return self;
  };

  this.withName = function (name) {
    self.name = name;
    return self;
  };

  this.withFestival = function (festival) {
    self.festival = festival;
    return self;
  };

  this.withCreatedAt = function (createdAt) {
    self.createdAt = createdAt;
    return self;
  };

  this.withUpdatedAt = function (updatedAt) {
    self.updatedAt = updatedAt;
    return self;
  };

  this.build = function () {
    return new Category(
      self.id,
      self.parent,
      self.name,
      self.festival,
      self.createdAt,
      self.updatedAt
    );
  };

};

module.exports = exports = {
  Category: Category,
  CategoryBuilder: CategoryBuilder
};