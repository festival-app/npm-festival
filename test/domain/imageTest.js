var chai = require('chai');
var should = chai.should();
var image = require('../../lib/domain/image');

describe('image domain test', function () {

  var url = 'url';
  var content = 'content';
  var order = 0;

  it('should create domain', function (done) {

    var imageDomain = new image.Image(
      url,
      content,
      order
    );

    should.exist(imageDomain);
    imageDomain.url.should.be.equal(url);
    imageDomain.content.should.be.equal(content);
    imageDomain.order.should.be.equal(order);

    done();
  });

  it('should create domain by builder', function (done) {

    var imageDomain = new image.ImageBuilder()
      .withUrl(url)
      .withContent(content)
      .withOrder(order)
      .build();

    should.exist(imageDomain);
    imageDomain.url.should.be.equal(url);
    imageDomain.content.should.be.equal(content);
    imageDomain.order.should.be.equal(order);

    done();
  });

});