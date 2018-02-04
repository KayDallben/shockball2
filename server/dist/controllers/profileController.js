'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //third party


var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _firebaseAdmin = require('firebase-admin');

var admin = _interopRequireWildcard(_firebaseAdmin);

var _Profile = require('../models/Profile.js');

var _Profile2 = _interopRequireDefault(_Profile);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FieldValue = admin.firestore.FieldValue;

//internal

var ProfileController = function () {
  function ProfileController(db, logger) {
    _classCallCheck(this, ProfileController);

    this.players = db.collection('players');
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
        var swcCharacter;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.getCharacterInfo(uid, accessToken);

              case 3:
                swcCharacter = _context2.sent;
                _context2.next = 6;
                return this.players.doc(uid).set({
                  name: swcCharacter.character.name,
                  image: swcCharacter.character.image,
                  gender: swcCharacter.character.gender,
                  race: swcCharacter.character.race.value,
                  created: FieldValue.serverTimestamp(),
                  createdAsUid: uid
                });

              case 6:
                _context2.next = 8;
                return this.players.doc(uid).get().then(function (doc) {
                  return doc.data();
                });

              case 8:
                return _context2.abrupt('return', _context2.sent);

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2['catch'](0);

                this.logger.error(_context2.t0);
                return _context2.abrupt('return', false);

              case 15:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 11]]);
      }));

      function createNewPlayer(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return createNewPlayer;
    }()
  }, {
    key: 'checkIfPlayerExists',
    value: function checkIfPlayerExists(uid) {
      var _this = this;

      return this.players.doc(uid).get().then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          return false;
        }
      }).catch(function (error) {
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