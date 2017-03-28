'use strict';

const logger = require('winston');
const config = require('config');
const logLevel = process.env.LOG_LEVEL || 'info';

if (config.loggly && !logger.transports.Loggly) {
  const Loggly = require('winston-loggly').Loggly;

  logger.add(Loggly, config.loggly);
}

logger.level = logLevel;

if (process.env.LOG_STREAM) {
  logger.add(logger.transports.File, {
      filename: process.env.LOG_STREAM,
      level: logLevel
    }
  );
}

module.exports.changeLogLevel = newLogLevel => {
  logger.level = newLogLevel;
};

logger.args = function args(msg, params) {
  logger.debug(msg, params[0]);
};


module.exports.logger = logger;