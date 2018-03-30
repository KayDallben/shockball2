'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //third party


//internal


var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _firebaseAdmin = require('firebase-admin');

var admin = _interopRequireWildcard(_firebaseAdmin);

var _Contract = require('../models/Contract.js');

var _Contract2 = _interopRequireDefault(_Contract);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FieldValue = admin.firestore.FieldValue;

var ContractController = function () {
  function ContractController(db, logger) {
    _classCallCheck(this, ContractController);

    this.contracts = db.collection('contracts');
    this.accounts = db.collection('accounts');
    this.logger = logger;
  }

  _createClass(ContractController, [{
    key: 'list',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var validation;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                validation = _joi2.default.validate(req.query, _Contract2.default.listParams);

                if (!(validation.error === null)) {
                  _context.next = 13;
                  break;
                }

                _context.prev = 2;
                _context.next = 5;
                return this.contracts.where(req.query.queryProp, '==', req.query.queryVal).get().then(function (snapshot) {
                  var contracts = [];
                  snapshot.forEach(function (doc) {
                    contracts.push(doc.data());
                  });
                  res.status(200).send(contracts);
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
    key: 'listOne',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var validation;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                validation = _joi2.default.validate(req.params, _Contract2.default.listOneParams);

                if (!(validation.error === null)) {
                  _context2.next = 13;
                  break;
                }

                _context2.prev = 2;
                _context2.next = 5;
                return this.contracts.doc(req.params.id).get().then(function (doc) {
                  res.status(200).send(doc.data());
                });

              case 5:
                _context2.next = 11;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](2);

                this.logger.error(_context2.t0);
                res.status(400).send(_context2.t0);

              case 11:
                _context2.next = 15;
                break;

              case 13:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 15:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 7]]);
      }));

      function listOne(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return listOne;
    }()
  }, {
    key: 'create',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
        var _this = this;

        var validation, updateSet;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                validation = _joi2.default.validate(req.body, _Contract2.default.create);

                if (!(validation.error === null)) {
                  _context5.next = 14;
                  break;
                }

                _context5.prev = 2;
                updateSet = req.body;
                _context5.next = 6;
                return this.accounts.doc(req.body.teamUid).get().then(function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(doc) {
                    var teamAccount, newContract;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            teamAccount = doc.data();

                            if (!(teamAccount.availableBudget - req.body.purchasePrice < 0)) {
                              _context4.next = 6;
                              break;
                            }

                            res.status(400).send('Cannot spend more than availble team budget!');
                            return _context4.abrupt('return');

                          case 6:
                            _context4.next = 8;
                            return _this.contracts.add(updateSet);

                          case 8:
                            newContract = _context4.sent;
                            _context4.next = 11;
                            return newContract.update({
                              contractUid: newContract.id,
                              created: FieldValue.serverTimestamp(),
                              lastModified: FieldValue.serverTimestamp()
                            });

                          case 11:
                            _context4.next = 13;
                            return _this.contracts.doc(newContract.id).get().then(function () {
                              var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(doc2) {
                                var savedContract;
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                  while (1) {
                                    switch (_context3.prev = _context3.next) {
                                      case 0:
                                        savedContract = doc2.data();
                                        _context3.next = 3;
                                        return _this.updateTeamAccount(savedContract, teamAccount);

                                      case 3:
                                        res.status(201).send(savedContract);

                                      case 4:
                                      case 'end':
                                        return _context3.stop();
                                    }
                                  }
                                }, _callee3, _this);
                              }));

                              return function (_x8) {
                                return _ref5.apply(this, arguments);
                              };
                            }());

                          case 13:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this);
                  }));

                  return function (_x7) {
                    return _ref4.apply(this, arguments);
                  };
                }());

              case 6:
                _context5.next = 12;
                break;

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5['catch'](2);

                this.logger.error(_context5.t0);
                res.status(400).send(_context5.t0);

              case 12:
                _context5.next = 16;
                break;

              case 14:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 16:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[2, 8]]);
      }));

      function create(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: 'updateTeamAccount',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(contract, teamAccount) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.accounts.doc(contract.teamUid).collection('transactions').add({
                  activityType: 'Player contract bid sent to ' + contract.playerName,
                  timestamp: FieldValue.serverTimestamp(),
                  amount: contract.purchasePrice
                });

              case 2:
                _context6.next = 4;
                return this.accounts.doc(contract.teamUid).update({
                  availableBudget: teamAccount.availableBudget - contract.purchasePrice
                });

              case 4:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function updateTeamAccount(_x9, _x10) {
        return _ref6.apply(this, arguments);
      }

      return updateTeamAccount;
    }()
  }]);

  return ContractController;
}();

exports.default = ContractController;
//# sourceMappingURL=contractController.js.map