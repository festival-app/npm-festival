'use strict';

class Image {
  constructor(url, content, order) {
    this.url = url;
    this.content = content;
    this.order = order;
  }
}

class ImageBuilder {
  constructor() {
    this.url = null;
    this.content = null;
    this.order = null;
  }

  withUrl(url) {
    this.url = url;
    return this;
  };

  withContent(content) {
    this.content = content;
    return this;
  };

  withOrder(order) {
    this.order = order;
    return this;
  };

  build() {
    return new Image(
      this.url,
      this.content,
      this.order
    );
  }
}

module.exports = {
  Image: Image,
  ImageBuilder: ImageBuilder
};
