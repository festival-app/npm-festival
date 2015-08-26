var chai = require('chai');
var should = chai.should();
var duration = require('../../lib/domain/duration');

describe('duration domain test', function () {

  var startAt = 'startAt';
  var finishAt = 'finishAt';

  it('should create domain', function (done) {

    var durationDomain = new duration.Duration(
      startAt,
      finishAt
    );

    should.exist(durationDomain);
    durationDomain.startAt.should.be.equal(startAt);
    durationDomain.finishAt.should.be.equal(finishAt);

    done();
  });

  it('should create domain by builder', function (done) {

    var durationDomain = new duration.DurationBuilder()
      .withStartAt(startAt)
      .withFinishAt(finishAt)
      .build();

    should.exist(durationDomain);
    durationDomain.startAt.should.be.equal(startAt);
    durationDomain.finishAt.should.be.equal(finishAt);

    done();
  });

});