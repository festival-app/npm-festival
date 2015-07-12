var Image = function Image(url, content, order) {
  this.url = url;
  this.content = content;
  this.order = order;
};

var ImageBuilder = function ImageBuilder() {
  this.url = null;
  this.content = null;
  this.order = null;

  var _this = this;

  this.withUrl = function (url) {
    _this.url = url;
    return _this;
  };

  this.withContent = function (content) {
    _this.content = content;
    return _this;
  };

  this.withOrder = function (order) {
    _this.order = order;
    return _this;
  };

  this.build = function () {
    return new Image(
      _this.url,
      _this.content,
      _this.order
    );
  };

};

module.exports = exports = {
  Image: Image,
  ImageBuilder: ImageBuilder
};