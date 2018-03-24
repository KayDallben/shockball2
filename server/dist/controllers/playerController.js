'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //third party


//internal


var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _Player = require('../models/Player.js');

var _Player2 = _interopRequireDefault(_Player);

var _util = require('../lib/util.js');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayerController = function () {
  function PlayerController(db, logger) {
    _classCallCheck(this, PlayerController);

    this.players = db.collection('players');
    this.teams = db.collection('teams');
    this.events = db.collection('events');
    this.contracts = db.collection('contracts');
    this.logger = logger;
  }

  _createClass(PlayerController, [{
    key: 'list',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var validation;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                validation = _joi2.default.validate(req.params, _Player2.default.listParams);

                if (!(validation.error === null)) {
                  _context.next = 13;
                  break;
                }

                _context.prev = 2;
                _context.next = 5;
                return this.players.get().then(function (snapshot) {
                  var players = [];
                  snapshot.forEach(function (doc) {
                    players.push(doc.data());
                  });
                  if (players.length > -1) {
                    res.status(200).send(players);
                  } else {
                    throw {
                      name: 'NoPlayersExist',
                      message: 'There were no players found in the database for this query!'
                    };
                  }
                });

              case 5:
                _context.next = 11;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](2);

                this.logger.error(_context.t0);
                res.status(400).send(_context.t0);

              case 11:
                _context.next = 15;
                break;

              case 13:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 7]]);
      }));

      function list(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return list;
    }()
  }, {
    key: 'update',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var _this = this;

        var id, validation, updateSet;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                id = req.params.id;
                validation = _joi2.default.validate(req.query, _Player2.default.updateParams);

                if (!(validation.error === null)) {
                  _context3.next = 15;
                  break;
                }

                _context3.prev = 3;
                updateSet = {
                  regimen: JSON.parse(req.query.regimen)
                };
                _context3.next = 7;
                return this.players.doc(id).update(updateSet).then(function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(doc) {
                    var updatedLine;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return _this.players.doc(id).get().then(function (doc2) {
                              res.status(200).send(doc2.data());
                            });

                          case 2:
                            updatedLine = _context2.sent;

                          case 3:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this);
                  }));

                  return function (_x5) {
                    return _ref3.apply(this, arguments);
                  };
                }());

              case 7:
                _context3.next = 13;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3['catch'](3);

                this.logger.error(_context3.t0);
                res.status(400).send(_context3.t0);

              case 13:
                _context3.next = 17;
                break;

              case 15:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 17:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 9]]);
      }));

      function update(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'listOne',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
        var _this2 = this;

        var validation;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                validation = _joi2.default.validate(req.params, _Player2.default.listOneParams);

                if (!(validation.error === null)) {
                  _context5.next = 13;
                  break;
                }

                _context5.prev = 2;
                _context5.next = 5;
                return this.players.doc(req.params.id).get().then(function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(doc) {
                    var playerData;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            playerData = doc.data();

                            playerData.teamData = {};
                            playerData.contractData = {};
                            playerData.records = [];

                            if (!(playerData.teamUid && playerData.teamUid.length > 0)) {
                              _context4.next = 7;
                              break;
                            }

                            _context4.next = 7;
                            return _this2.teams.doc(playerData.teamUid).get().then(function (doc2) {
                              playerData.teamData = doc2.data();
                            });

                          case 7:
                            if (!(playerData.contractUid && playerData.contractUid.length > 0)) {
                              _context4.next = 10;
                              break;
                            }

                            _context4.next = 10;
                            return _this2.contracts.doc(playerData.contractUid).get().then(function (doc3) {
                              playerData.contractData = doc3.data();
                            });

                          case 10:
                            _context4.next = 12;
                            return _this2.events.where('actorUid', '==', playerData.createdAsUid).get().then(function (snapshot) {
                              var events = [];
                              snapshot.forEach(function (doc4) {
                                events.push(doc4.data());
                              });
                              if (events.length > 0) {
                                playerData.records = util.generateSummaryRecords(events);
                              }
                            });

                          case 12:
                            res.status(200).send(playerData);

                          case 13:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this2);
                  }));

                  return function (_x8) {
                    return _ref5.apply(this, arguments);
                  };
                }());

              case 5:
                _context5.next = 11;
                break;

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5['catch'](2);

                this.logger.error(_context5.t0);
                res.status(400).send(_context5.t0);

              case 11:
                _context5.next = 15;
                break;

              case 13:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 15:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 7]]);
      }));

      function listOne(_x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return listOne;
    }()
  }]);

  return PlayerController;
}();

exports.default = PlayerController;
//# sourceMappingURL=playerController.js.map