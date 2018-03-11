'use strict';

// winston doesn't work in es6 for some reason...
var winston = require('winston');

var level = process.env.LOG_LEVEL || 'debug';

var logger = new winston.Logger({
  transports: [new winston.transports.Console({
    level: level,
    timestamp: function timestamp() {
      return new Date().toISOString();
    }
  })]
});

module.exports = logger;
//# sourceMappingURL=logger.js.map