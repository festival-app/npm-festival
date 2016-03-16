'use strict';

var Duration = function Duration(startAt, finishAt) {
  this.startAt = startAt;
  this.finishAt = finishAt;
};

var DurationBuilder = function DurationBuilder() {
  this.startAt = null;
  this.finishAt = null;

  var _this = this;

  this.withStartAt = function (startAt) {
    _this.startAt = startAt;
    return _this;
  };

  this.withFinishAt = function (finishAt) {
    _this.finishAt = finishAt;
    return _this;
  };

  this.build = function () {
    return new Duration(
      _this.startAt,
      _this.finishAt
    );
  };

};

module.exports = {
  Duration: Duration,
  DurationBuilder: DurationBuilder
};