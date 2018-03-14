'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebaseAdmin = require('firebase-admin');

var admin = _interopRequireWildcard(_firebaseAdmin);

var _challenge = require('./challenge');

var _challenge2 = _interopRequireDefault(_challenge);

var _botGenerator = require('./botGenerator');

var _botGenerator2 = _interopRequireDefault(_botGenerator);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var botGenerator = new _botGenerator2.default();
var challenge = null; // will set once this.record is available
var util = new _util2.default();
var FieldValue = admin.firestore.FieldValue;

var Main = function () {
  function Main(matchData, World, Player, Pitch, Board, Ball, record) {
    _classCallCheck(this, Main);

    this.stopSim = false;
    this.now = Date.now();
    this.then = Date.now();
    this.fps = 1000;
    this.maxGameTime = 70;
    this.elapsed = null;
    this.matchData = matchData;
    this.World = World;
    this.Player = Player;
    this.Pitch = Pitch;
    this.Board = Board;
    this.Ball = Ball;
    this.record = record;
    this.counter = 0;
    this.db = null;
  }

  _createClass(Main, [{
    key: 'beginGame',
    value: function beginGame(framesPerSecond, maxGameTime, db) {
      if (util.getType(framesPerSecond) === '[object Number]') {
        this.db = db;
        challenge = new _challenge2.default(this.record);
        this.fps = framesPerSecond;
        this.maxGameTime = maxGameTime ? maxGameTime : this.maxGameTime;
        //register world
        this.world = new this.World();

        //register pitch
        var pitch = new this.Pitch(this.matchData);
        this.world.register(pitch);

        //register scoreboard
        var board = new this.Board(this.matchData, pitch, this.maxGameTime);
        this.world.register(board);

        //register ball
        var ball = new this.Ball(pitch);
        this.world.register(ball);

        // register home team players on left side
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.matchData.homeTeam.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var player = _step.value;

            var _playerToAdd2 = new this.Player(player, this.world, challenge, 'left');
            this.world.register(_playerToAdd2);
            this.world.leftPlayers.push(_playerToAdd2);
          }

          // register away team players on right side
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.matchData.awayTeam.players[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _player = _step2.value;

            var _playerToAdd3 = new this.Player(_player, this.world, challenge, 'right');
            this.world.register(_playerToAdd3);
            this.world.rightPlayers.push(_playerToAdd3);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        if (this.matchData.homeTeam.players.length < 4) {
          for (var i = this.matchData.homeTeam.players.length; i < 4; i++) {
            var bot = botGenerator.create(this.matchData.homeTeam.id, this.matchData.homeTeam.teamName, this.matchData.homeTeam.teamPicUrl);
            var playerToAdd = new this.Player(bot, this.world, challenge, 'left');
            this.world.register(playerToAdd);
            this.world.leftPlayers.push(playerToAdd);
          }
        }

        if (this.matchData.awayTeam.players.length < 4) {
          for (var i = this.matchData.awayTeam.players.length; i < 4; i++) {
            var _bot = botGenerator.create(this.matchData.awayTeam.id, this.matchData.awayTeam.teamName, this.matchData.awayTeam.teamPicUrl);
            var _playerToAdd = new this.Player(_bot, this.world, challenge, 'right');
            this.world.register(_playerToAdd);
            this.world.rightPlayers.push(_playerToAdd);
          }
        }

        //start main game loop
        this.mainLoop();
      } else {
        throw new Error('Cannot start game: incorrect param data types');
      }
    }
  }, {
    key: 'mainLoop',
    value: function mainLoop() {
      if (this.stopSim) {
        return;
      }
      this.now = Date.now();
      this.elapsed = this.now - this.then;

      if (this.elapsed > this.fps) {
        this.update();
        this.then = this.now - this.elapsed % this.fps;
      }
      // window.requestAnimationFrame(this.mainLoop.bind(this))
      setImmediate(this.mainLoop.bind(this));
    }
  }, {
    key: 'update',
    value: function update() {
      this.world.update();
      challenge.update(this.world);
      challenge.reset();
      this.counter++;
      if (this.counter.toString() === '5') {}
      // this.stopSim = true

      // console.log('counter is: ' + this.counter )
      if (this.world.objects[1]['gameTime'] === this.maxGameTime) {
        this.stopSim = true;
        this.writeMatchRecords(this.world);
      }
    }
  }, {
    key: 'writeMatchRecords',
    value: function writeMatchRecords(world) {
      this.savePlayerRecords(this.record.records);
      this.saveTeamRecords(world);
    }
  }, {
    key: 'saveTeamRecords',
    value: function saveTeamRecords(world) {
      var gameResults = {
        homeTeamScore: world.objects[1]['leftScore'],
        homeTeamName: world.objects[1]['leftTeamName'],
        awayTeamScore: world.objects[1]['rightScore'],
        awayTeamName: world.objects[1]['rightTeamName'],
        startTime: world.objects[1]['startTime'],
        lastUpdated: FieldValue.serverTimestamp(),
        status: 'complete'
      };
      this.db.collection('fixtures').doc(this.matchData.fixtureId).update(gameResults);
    }
  }, {
    key: 'savePlayerRecords',
    value: function savePlayerRecords(events) {
      var _this = this;

      var batch = this.db.batch();
      events.forEach(function (record) {
        record.fixtureId = _this.matchData.fixtureId;
        var ref = _this.db.collection('events').doc();
        batch.set(ref, record);
      });

      batch.commit();
    }
  }]);

  return Main;
}();

exports.default = Main;
//# sourceMappingURL=main.js.map