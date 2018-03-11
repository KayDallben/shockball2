'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _swaggerJsdoc = require('swagger-jsdoc');

var _swaggerJsdoc2 = _interopRequireDefault(_swaggerJsdoc);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _routes = require('./routes/routes');

var _routes2 = _interopRequireDefault(_routes);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create express application
// 3rd party packages
var app = (0, _express2.default)();

// initialize morgan http logging


// our files/packages
app.use((0, _morgan2.default)('dev', {
  skip: function skip(req, res) {
    return res.statusCode < 400;
  }, stream: process.stderr
}));

app.use((0, _morgan2.default)('dev', {
  skip: function skip(req, res) {
    return res.statusCode >= 400;
  }, stream: process.stdout
}));

//enable cors
app.use((0, _cors2.default)());

// Enforce http body limit
app.use(_bodyParser2.default.json({
  limit: '100kb'
}));

// No view engine, serve client folder (index.html) instead
app.use(_express2.default.static(_path2.default.join(__dirname, '../../', 'public')));

// use custom favicon
app.use((0, _serveFavicon2.default)(_path2.default.join(__dirname, '../../', 'public', 'docs', 'images', 'favicon.ico')));

// enabling gzip compression of responses: https://github.com/expressjs/compression
app.use((0, _compression2.default)());

// http/https basic security: https://github.com/helmetjs/helmet
app.use((0, _helmet2.default)());

// create swagger configuration: https://github.com/Surnet/swagger-jsdoc
var schemeType = process.env.HEROKU ? 'https' : 'http';
var options = {
  swaggerDefinition: {
    info: {
      title: 'Shockball2', // Title (required)
      version: '0.1.0', // Version (required)
      description: 'Fantasy Sports Simulation for Star Wars Combine'
    },
    host: process.env.FIREBASE_DATABASE_URL ? 'shockball2.herokuapp.com' : 'localhost:8080',
    schemes: [schemeType],
    securityDefinitions: {
      'jwt': {
        'type': 'apiKey',
        'name': 'Authorization',
        'in': 'header'
      }
    },
    security: [{
      jwt: []
    }],
    basePath: '/'
  },
  apis: ['./server/src/routes/routes.js']

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
};var swaggerSpec = (0, _swaggerJsdoc2.default)(options);

// serve swagger
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// connect to db, and ensure it is up before we start our api
(0, _db2.default)(app, function (db) {
  app.use('/api', (0, _routes2.default)(db, _logger2.default));
});

exports.default = app;
//# sourceMappingURL=app.js.map