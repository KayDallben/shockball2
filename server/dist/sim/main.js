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

        this.createWorldHumanPlayers(this.world, challenge);
        this.createWorldNpcPlayers(this.world, challenge);

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
      this.counter++;
      try {
        this.world.update(challenge);
      } catch (error) {
        console.log(error);
      }

      challenge.update(this.world);
      challenge.reset();

      if (this.world.objects[1]['gameTime'] === this.maxGameTime) {
        this.stopSim = true;
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@RECORDS@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.log(this.record.records);
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$WORLD$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
        console.log(this.world);
        // this.writeMatchRecords(this.world)
      }
    }
  }, {
    key: 'createWorldHumanPlayers',
    value: function createWorldHumanPlayers(world, challenge) {
      // register home team players on left side
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.matchData.homeTeam.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var player = _step.value;

          var playerToAdd = new this.Player(player, world, challenge, 'left');
          if (playerToAdd.role !== undefined) {
            if (['center1', 'left1', 'right1', 'guard1'].indexOf(playerToAdd.lineupPosition) >= 0) {
              world.register(playerToAdd);
              world.addToField('left', playerToAdd);
            } else if (['center2', 'left2', 'right2', 'guard2', 'sub1', 'sub2'].indexOf(playerToAdd.lineupPosition) >= 0) {
              world.addToBench('left', playerToAdd);
            }
          }
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

          var _playerToAdd = new this.Player(_player, world, challenge, 'right');
          if (_playerToAdd.role !== undefined) {
            if (['center1', 'left1', 'right1', 'guard1'].indexOf(_playerToAdd.lineupPosition) >= 0) {
              world.register(_playerToAdd);
              world.addToField('right', _playerToAdd);
            } else if (['center2', 'left2', 'right2', 'guard2', 'sub1', 'sub2'].indexOf(_playerToAdd.lineupPosition) >= 0) {
              world.addToBench('right', _playerToAdd);
            }
          }
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
    }
  }, {
    key: 'createWorldNpcPlayers',
    value: function createWorldNpcPlayers(world, challenge) {
      // create bots for teams lacking players
      var totalHomeTeamFieldSize = world.leftPlayers.length;
      var totalHomeTeamBenchSize = world.leftBench.Center.length + world.leftBench.Wing.length + world.leftBench.Guard.length + world.leftBench.Sub.length;
      var totalHomeTeamSize = totalHomeTeamFieldSize + totalHomeTeamBenchSize;

      var totalAwayTeamFieldSize = world.rightPlayers.length;
      var totalAwayTeamBenchSize = world.rightBench.Center.length + world.rightBench.Wing.length + world.rightBench.Guard.length + world.rightBench.Sub.length;
      var totalAwayTeamSize = totalAwayTeamFieldSize + totalAwayTeamBenchSize;

      // if (this.matchData.homeTeam.players.length < 4) {
      if (totalHomeTeamSize < 10) {
        for (var i = totalHomeTeamSize; i < 10; i++) {
          var bot = botGenerator.create(this.matchData.homeTeam.id, this.matchData.homeTeam.teamName, this.matchData.homeTeam.teamPicUrl);
          var playerToAdd = new this.Player(bot, world, challenge, 'left');
          if (totalHomeTeamFieldSize < 4) {
            world.register(playerToAdd);
            world.addToField('left', playerToAdd);
            totalHomeTeamFieldSize++;
          } else if (totalHomeTeamBenchSize < 6) {
            world.addToBench('left', playerToAdd);
            totalHomeTeamBenchSize++;
          }
        }
      }

      // create bots for teams lacking players
      if (totalAwayTeamSize < 10) {
        for (var o = totalAwayTeamSize; o < 10; o++) {
          var _bot = botGenerator.create(this.matchData.awayTeam.id, this.matchData.awayTeam.teamName, this.matchData.awayTeam.teamPicUrl);
          var _playerToAdd2 = new this.Player(_bot, world, challenge, 'right');
          if (totalAwayTeamFieldSize < 4) {
            world.register(_playerToAdd2);
            world.addToField('right', _playerToAdd2);
            totalAwayTeamFieldSize++;
          } else if (totalAwayTeamBenchSize < 6) {
            world.addToBench('right', _playerToAdd2);
            totalAwayTeamBenchSize++;
          }
        }
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