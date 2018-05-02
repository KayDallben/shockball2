'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //third party


//internal


var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _firebaseAdmin = require('firebase-admin');

var admin = _interopRequireWildcard(_firebaseAdmin);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _Profile = require('../models/Profile.js');

var _Profile2 = _interopRequireDefault(_Profile);

var _util = require('../lib/util.js');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FieldValue = admin.firestore.FieldValue;
var chance = new _chance2.default();

var ProfileController = function () {
  function ProfileController(db, logger) {
    _classCallCheck(this, ProfileController);

    this.players = db.collection('players');
    this.teams = db.collection('teams');
    this.contracts = db.collection('contracts');
    this.accounts = db.collection('accounts');
    this.events = db.collection('events');
    this.playerCaps = db.collection('playerCaps');
    this.logger = logger;
  }

  _createClass(ProfileController, [{
    key: 'listOne',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var validation, player, newPlayer;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                validation = _joi2.default.validate(req.query, _Profile2.default.listOneParams);

                if (!(validation.error === null)) {
                  _context.next = 24;
                  break;
                }

                _context.prev = 2;
                _context.next = 5;
                return this.checkIfPlayerExists(req.uid);

              case 5:
                player = _context.sent;

                if (!player) {
                  _context.next = 10;
                  break;
                }

                res.status(200).send(player);
                _context.next = 16;
                break;

              case 10:
                _context.next = 12;
                return this.createNewPlayer(req.uid, req.swcToken, false);

              case 12:
                newPlayer = _context.sent;
                _context.next = 15;
                return this.decoratePlayer(newPlayer);

              case 15:
                if (newPlayer) {
                  res.status(201).send(newPlayer);
                } else {
                  res.status(400).send('Error creating new player in database');
                }

              case 16:
                _context.next = 22;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context['catch'](2);

                this.logger.error(_context.t0);
                res.status(400).send(_context.t0);

              case 22:
                _context.next = 26;
                break;

              case 24:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 26:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 18]]);
      }));

      function listOne(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return listOne;
    }()
  }, {
    key: 'createNewPlayer',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(uid, accessToken, isNpc) {
        var baseStats, playerValue, swcCharacter, playerEntity, newPlayer;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                baseStats = this.rollBaseStats();
                playerValue = util.calculatePlayerValue(baseStats);
                swcCharacter = null;

                if (isNpc) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 7;
                return this.getCharacterInfo(uid, accessToken);

              case 7:
                swcCharacter = _context2.sent;
                _context2.next = 11;
                break;

              case 10:
                swcCharacter = {
                  character: this.generateNpcCharacter()
                };

              case 11:
                playerEntity = {
                  name: swcCharacter.character.name,
                  image: swcCharacter.character.image,
                  gender: swcCharacter.character.gender,
                  race: swcCharacter.character.race.value,
                  created: FieldValue.serverTimestamp(),
                  swcPlayerUid: uid,
                  passing: baseStats.passing,
                  throwing: baseStats.throwing,
                  blocking: baseStats.blocking,
                  toughness: baseStats.toughness,
                  morale: baseStats.morale,
                  vision: baseStats.vision,
                  leadership: baseStats.leadership,
                  aggression: baseStats.aggression,
                  endurance: baseStats.endurance,
                  energy: baseStats.energy,
                  marketValue: playerValue.marketValue,
                  rating: playerValue.playerRating
                };
                _context2.next = 14;
                return this.players.add(playerEntity);

              case 14:
                newPlayer = _context2.sent;
                _context2.next = 17;
                return this.players.doc(newPlayer.id).update({
                  shockballPlayerUid: newPlayer.id
                });

              case 17:
                _context2.next = 19;
                return this.createPlayerStatCaps(newPlayer.id);

              case 19:
                _context2.next = 21;
                return this.createPlayerAccount(newPlayer.id, playerEntity);

              case 21:
                _context2.next = 23;
                return this.players.doc(newPlayer.id).get().then(function (doc) {
                  return doc.data();
                });

              case 23:
                return _context2.abrupt('return', _context2.sent);

              case 26:
                _context2.prev = 26;
                _context2.t0 = _context2['catch'](0);

                this.logger.error(_context2.t0);
                return _context2.abrupt('return', false);

              case 30:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 26]]);
      }));

      function createNewPlayer(_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return createNewPlayer;
    }()
  }, {
    key: 'generateNpcCharacter',
    value: function generateNpcCharacter() {
      var npc = {
        name: 'Billy Joe Bobby Jones',
        image: 'http://i736.photobucket.com/albums/xx4/bpkennedy/norringtonfreelance.jpg',
        gender: 'male',
        race: 'human'
      };
      return npc;
    }
  }, {
    key: 'rollBaseStats',
    value: function rollBaseStats() {
      var baseStats = {
        passing: chance.integer({ min: 40, max: 60 }),
        throwing: chance.integer({ min: 40, max: 60 }),
        blocking: chance.integer({ min: 40, max: 60 }),
        toughness: chance.integer({ min: 40, max: 60 }),
        endurance: chance.integer({ min: 40, max: 60 }),
        vision: chance.integer({ min: 40, max: 60 }),
        morale: chance.integer({ min: 70, max: 100 }),
        leadership: chance.integer({ min: 10, max: 80 }),
        aggression: 0,
        energy: chance.integer({ min: 70, max: 100 })
      };
      return baseStats;
    }
  }, {
    key: 'createPlayerAccount',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(playerId, player) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.accounts.doc(playerId).set({
                  shockballPlayerUid: playerId,
                  name: player.name,
                  created: FieldValue.serverTimestamp(),
                  lastModified: FieldValue.serverTimestamp(),
                  totalBalance: 0
                });

              case 2:
                _context3.next = 4;
                return this.accounts.doc(playerId).collection('transactions').add({
                  activityType: 'Player account created for ' + player.name,
                  timestamp: FieldValue.serverTimestamp(),
                  amount: 0
                });

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function createPlayerAccount(_x6, _x7) {
        return _ref3.apply(this, arguments);
      }

      return createPlayerAccount;
    }()
  }, {
    key: 'createPlayerStatCaps',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(uid) {
        var playerWithStatCaps;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                playerWithStatCaps = {
                  shockballPlayerUid: uid,
                  created: FieldValue.serverTimestamp(),
                  passing: chance.integer({ min: 75, max: 100 }),
                  throwing: chance.integer({ min: 75, max: 100 }),
                  blocking: chance.integer({ min: 75, max: 100 }),
                  toughness: chance.integer({ min: 75, max: 100 }),
                  endurance: chance.integer({ min: 75, max: 100 }),
                  vision: chance.integer({ min: 75, max: 100 })
                };
                _context4.next = 3;
                return this.playerCaps.doc(uid).set(playerWithStatCaps);

              case 3:
                return _context4.abrupt('return', _context4.sent);

              case 4:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function createPlayerStatCaps(_x8) {
        return _ref4.apply(this, arguments);
      }

      return createPlayerStatCaps;
    }()
  }, {
    key: 'decoratePlayer',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(player) {
        var playerData;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                playerData = player;

                playerData.teamData = {};
                playerData.contractData = {};

                if (!(playerData.teamUid && playerData.teamUid.length > 0)) {
                  _context5.next = 6;
                  break;
                }

                _context5.next = 6;
                return this.teams.doc(playerData.teamUid).get().then(function (doc2) {
                  playerData.teamData = doc2.data();
                });

              case 6:
                if (!(playerData.contractUid && playerData.contractUid.length > 0)) {
                  _context5.next = 9;
                  break;
                }

                _context5.next = 9;
                return this.contracts.doc(playerData.contractUid).get().then(function (doc3) {
                  playerData.contractData = doc3.data();
                });

              case 9:
                _context5.prev = 9;

                if (!playerData.shockballPlayerUid) {
                  playerData.shockballPlayerUid = '1';
                }
                _context5.next = 13;
                return this.events.where('actorUid', '==', playerData.shockballPlayerUid).get().then(function (snapshot) {
                  var events = [];
                  snapshot.forEach(function (doc4) {
                    events.push(doc4.data());
                  });
                  if (events.length > 0) {
                    playerData.records = util.generateSummaryRecords(events);
                  } else {
                    playerData.records = [{
                      season: '1',
                      matches: 0,
                      goals: 0,
                      shots: 0,
                      passes: 0,
                      blocksPass: 0,
                      blocksShot: 0,
                      tackles: 0,
                      runsBall: 0,
                      goalAverage: 0
                    }];
                  }
                });

              case 13:
                _context5.next = 18;
                break;

              case 15:
                _context5.prev = 15;
                _context5.t0 = _context5['catch'](9);

                this.logger.error(_context5.t0);

              case 18:
                return _context5.abrupt('return', playerData);

              case 19:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[9, 15]]);
      }));

      function decoratePlayer(_x9) {
        return _ref5.apply(this, arguments);
      }

      return decoratePlayer;
    }()
  }, {
    key: 'checkIfPlayerExists',
    value: function checkIfPlayerExists(swcPlayerUid) {
      var _this = this;

      // important: here we are taking the swcUser uid to find the player - so this is a query to players collection
      return this.players.where('swcPlayerUid', '==', swcPlayerUid).get().then(function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(snapshot) {
          var players, player, decoratedPlayer;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  players = [];

                  snapshot.forEach(function (doc) {
                    players.push(doc.data());
                  });

                  if (!(players.length > 0)) {
                    _context6.next = 17;
                    break;
                  }

                  player = players[0]; // Should only ever be a single user, but this takes the first if there happens to be more than one?

                  _context6.prev = 4;
                  _context6.next = 7;
                  return _this.decoratePlayer(player);

                case 7:
                  decoratedPlayer = _context6.sent;
                  return _context6.abrupt('return', decoratedPlayer);

                case 11:
                  _context6.prev = 11;
                  _context6.t0 = _context6['catch'](4);

                  _this.logger.error(_context6.t0);
                  return _context6.abrupt('return', false);

                case 15:
                  _context6.next = 19;
                  break;

                case 17:
                  _this.logger.error('checkIfPlayerExists did not find a matching player');
                  return _context6.abrupt('return', false);

                case 19:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, _this, [[4, 11]]);
        }));

        return function (_x10) {
          return _ref6.apply(this, arguments);
        };
      }());
    }
  }, {
    key: 'getCharacterInfo',
    value: function getCharacterInfo(uid, accessToken) {
      var _this2 = this;

      return (0, _axios2.default)({
        url: 'http://www.swcombine.com/ws/v1.0/character/' + uid + '/',
        method: 'GET',
        params: {
          'access_token': accessToken
        },
        headers: {
          'Accept': 'application/json'
        }
      }).then(function (response) {
        return response.data;
      }).catch(function (error) {
        _this2.logger.error('Error calling character info at SWC');
        _this2.logger.error(error);
        return error;
      });
    }
  }]);

  return ProfileController;
}();

exports.default = ProfileController;
//# sourceMappingURL=profileController.js.map