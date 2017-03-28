'use strict';

class Duration {
  constructor(startAt, finishAt) {
    this.startAt = startAt;
    this.finishAt = finishAt;
  }
}

class DurationBuilder {
  constructor() {
    this.startAt = null;
    this.finishAt = null;
  }

  withStartAt(startAt) {
    this.startAt = startAt;
    return this;
  };

  withFinishAt(finishAt) {
    this.finishAt = finishAt;
    return this;
  };

  build() {
    return new Duration(
      this.startAt,
      this.finishAt
    );
  }
}

module.exports = {
  Duration: Duration,
  DurationBuilder: DurationBuilder
};