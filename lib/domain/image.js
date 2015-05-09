var Image = function Image(url, content, order) {
  this.url = url;
  this.content = content;
  this.order = order;
};

var ImageBuilder = function ImageBuilder() {
  this.url = null;
  this.content = null;
  this.order = null;

  var self = this;

  this.withUrl = function (url) {
    self.url = url;
    return self;
  };

  this.withContent = function (content) {
    self.content = content;
    return self;
  };

  this.withOrder = function (order) {
    self.order = order;
    return self;
  };

  this.build = function () {
    return new Image(
      self.url,
      self.content,
      self.order
    );
  };

};

module.exports = exports = {
  Image: Image,
  ImageBuilder: ImageBuilder
};