'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runMatch = runMatch;

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _world = require('./world');

var _world2 = _interopRequireDefault(_world);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _pitch = require('./pitch');

var _pitch2 = _interopRequireDefault(_pitch);

var _board = require('./board');

var _board2 = _interopRequireDefault(_board);

var _ball = require('./ball');

var _ball2 = _interopRequireDefault(_ball);

var _record = require('./record');

var _record2 = _interopRequireDefault(_record);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import MatchData from './matchData'

function runMatch(serverMatchData, db) {
  // const matchData = new MatchData()
  var record = new _record2.default(serverMatchData.fixtureId, serverMatchData.season);
  var fps = 5;
  var maxGameTime = 70;
  var main = new _main2.default(serverMatchData, _world2.default, _player2.default, _pitch2.default, _board2.default, _ball2.default, record);
  main.beginGame(fps, maxGameTime, db);
}
//# sourceMappingURL=index.js.map