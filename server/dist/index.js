'use strict';

var _babelPolyfill = require('babel-polyfill');

var babelPolyfill = _interopRequireWildcard(_babelPolyfill);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// create http server
// 3rd party packages
_app2.default.server = _http2.default.createServer(_app2.default);

// Internal packages/libraries
//eslint-disable-line no-unused-vars


_app2.default.use(function (req, res) {
  _logger2.default.error('404 page requested');
  res.status(404).send('This page does not exist!');
});

// start the server
_app2.default.server.listen(process.env.PORT || '8080', function () {
  _logger2.default.info('Server listening on http://localhost:' + _app2.default.server.address().port); //eslint-disable-line no-console
});
//# sourceMappingURL=index.js.map