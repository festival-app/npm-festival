var Duration = function Duration(startAt, finishAt) {
  this.startAt = startAt;
  this.finishAt = finishAt;
};

var DurationBuilder = function DurationBuilder() {
  this.startAt = null;
  this.finishAt = null;

  var self = this;

  this.withStartAt = function (startAt) {
    self.startAt = startAt;
    return self;
  };

  this.withFinishAt = function (finishAt) {
    self.finishAt = finishAt;
    return self;
  };

  this.build = function () {
    return new Duration(
      self.startAt,
      self.finishAt
    );
  };

};

module.exports = exports = {
  Duration: Duration,
  DurationBuilder: DurationBuilder
};