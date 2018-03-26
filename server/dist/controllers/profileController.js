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
                  _context.next = 22;
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
                _context.next = 14;
                break;

              case 10:
                _context.next = 12;
                return this.createNewPlayer(req.uid, req.swcToken);

              case 12:
                newPlayer = _context.sent;

                if (newPlayer) {
                  res.status(201).send(newPlayer);
                } else {
                  res.status(400).send('Error creating new player in database');
                }

              case 14:
                _context.next = 20;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context['catch'](2);

                this.logger.error(_context.t0);
                res.status(400).send(_context.t0);

              case 20:
                _context.next = 24;
                break;

              case 22:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 24:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 16]]);
      }));

      function listOne(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return listOne;
    }()
  }, {
    key: 'createNewPlayer',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(uid, accessToken) {
        var baseStats, swcCharacter;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                baseStats = this.rollBaseStats();
                _context2.next = 4;
                return this.createPlayerStatCaps(uid);

              case 4:
                _context2.next = 6;
                return this.getCharacterInfo(uid, accessToken);

              case 6:
                swcCharacter = _context2.sent;
                _context2.next = 9;
                return this.players.doc(uid).set({
                  name: swcCharacter.character.name,
                  image: swcCharacter.character.image,
                  gender: swcCharacter.character.gender,
                  race: swcCharacter.character.race.value,
                  created: FieldValue.serverTimestamp(),
                  createdAsUid: uid,
                  passing: baseStats.passing,
                  throwing: baseStats.throwing,
                  blocking: baseStats.blocking,
                  toughness: baseStats.toughness,
                  morale: baseStats.morale,
                  vision: baseStats.vision,
                  leadership: baseStats.leadership,
                  aggression: baseStats.aggression,
                  endurance: baseStats.endurance,
                  fatigue: baseStats.fatigue
                });

              case 9:
                _context2.next = 11;
                return this.players.doc(uid).get().then(function (doc) {
                  return doc.data();
                });

              case 11:
                return _context2.abrupt('return', _context2.sent);

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2['catch'](0);

                this.logger.error(_context2.t0);
                return _context2.abrupt('return', false);

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 14]]);
      }));

      function createNewPlayer(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return createNewPlayer;
    }()
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
        fatigue: 0
      };
      return baseStats;
    }
  }, {
    key: 'createPlayerStatCaps',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(uid) {
        var playerWithStatCaps;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                playerWithStatCaps = {
                  createdAsUid: uid,
                  created: FieldValue.serverTimestamp(),
                  passing: chance.integer({ min: 75, max: 100 }),
                  throwing: chance.integer({ min: 75, max: 100 }),
                  blocking: chance.integer({ min: 75, max: 100 }),
                  toughness: chance.integer({ min: 75, max: 100 }),
                  endurance: chance.integer({ min: 75, max: 100 }),
                  vision: chance.integer({ min: 75, max: 100 })
                };
                _context3.next = 3;
                return this.playerCaps.doc(uid).set(playerWithStatCaps);

              case 3:
                return _context3.abrupt('return', _context3.sent);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function createPlayerStatCaps(_x5) {
        return _ref3.apply(this, arguments);
      }

      return createPlayerStatCaps;
    }()
  }, {
    key: 'checkIfPlayerExists',
    value: function checkIfPlayerExists(uid) {
      var _this = this;

      return this.players.doc(uid).get().then(function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(doc) {
          var playerData;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  if (!doc.exists) {
                    _context4.next = 15;
                    break;
                  }

                  playerData = doc.data();

                  playerData.teamData = {};
                  playerData.contractData = {};

                  if (!(playerData.teamUid && playerData.teamUid.length > 0)) {
                    _context4.next = 7;
                    break;
                  }

                  _context4.next = 7;
                  return _this.teams.doc(playerData.teamUid).get().then(function (doc2) {
                    playerData.teamData = doc2.data();
                  });

                case 7:
                  if (!(playerData.contractUid && playerData.contractUid.length > 0)) {
                    _context4.next = 10;
                    break;
                  }

                  _context4.next = 10;
                  return _this.contracts.doc(playerData.contractUid).get().then(function (doc3) {
                    playerData.contractData = doc3.data();
                  });

                case 10:
                  _context4.next = 12;
                  return _this.events.where('actorUid', '==', playerData.createdAsUid).get().then(function (snapshot) {
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

                case 12:
                  return _context4.abrupt('return', playerData);

                case 15:
                  return _context4.abrupt('return', false);

                case 16:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, _this);
        }));

        return function (_x6) {
          return _ref4.apply(this, arguments);
        };
      }()).catch(function (error) {
        _this.logger.error(error);
      });
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