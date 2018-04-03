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
    key: 'remove',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var validation, contract;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                validation = _joi2.default.validate(req.query, _Contract2.default.removeParams);

                if (!(validation.error === null)) {
                  _context3.next = 23;
                  break;
                }

                _context3.prev = 2;
                _context3.next = 5;
                return this.contracts.doc(req.params.id).get().then(function (doc) {
                  return doc.data();
                });

              case 5:
                contract = _context3.sent;
                _context3.next = 8;
                return this.contracts.doc(contract.contractUid).delete();

              case 8:
                _context3.next = 10;
                return this.updatePlayerTransactions(contract.playerUid, contract);

              case 10:
                _context3.next = 12;
                return this.returnTeamAvailableBudget(contract.teamUid, contract.purchasePrice);

              case 12:
                _context3.next = 14;
                return this.updateTeamAccountTransactions(contract.teamUid, contract);

              case 14:
                res.status(200).send('Contract deleted successfully');
                _context3.next = 21;
                break;

              case 17:
                _context3.prev = 17;
                _context3.t0 = _context3['catch'](2);

                this.logger.error(_context3.t0);
                res.status(400).send(_context3.t0);

              case 21:
                _context3.next = 25;
                break;

              case 23:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 25:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 17]]);
      }));

      function remove(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return remove;
    }()
  }, {
    key: 'create',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
        var _this = this;

        var validation, updateSet;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                validation = _joi2.default.validate(req.body, _Contract2.default.create);

                if (!(validation.error === null)) {
                  _context6.next = 14;
                  break;
                }

                _context6.prev = 2;
                updateSet = req.body;
                _context6.next = 6;
                return this.accounts.doc(req.body.teamUid).get().then(function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(doc) {
                    var teamAccount, newContract;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            teamAccount = doc.data();

                            if (!(teamAccount.availableBudget - req.body.purchasePrice < 0)) {
                              _context5.next = 6;
                              break;
                            }

                            res.status(400).send('Cannot spend more than available team budget!');
                            return _context5.abrupt('return');

                          case 6:
                            _context5.next = 8;
                            return _this.contracts.add(updateSet);

                          case 8:
                            newContract = _context5.sent;
                            _context5.next = 11;
                            return newContract.update({
                              contractUid: newContract.id,
                              created: FieldValue.serverTimestamp(),
                              lastModified: FieldValue.serverTimestamp()
                            });

                          case 11:
                            _context5.next = 13;
                            return _this.contracts.doc(newContract.id).get().then(function () {
                              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(doc2) {
                                var savedContract;
                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                  while (1) {
                                    switch (_context4.prev = _context4.next) {
                                      case 0:
                                        savedContract = doc2.data();
                                        _context4.next = 3;
                                        return _this.updateTeamAccount(savedContract, teamAccount);

                                      case 3:
                                        res.status(201).send(savedContract);

                                      case 4:
                                      case 'end':
                                        return _context4.stop();
                                    }
                                  }
                                }, _callee4, _this);
                              }));

                              return function (_x10) {
                                return _ref6.apply(this, arguments);
                              };
                            }());

                          case 13:
                          case 'end':
                            return _context5.stop();
                        }
                      }
                    }, _callee5, _this);
                  }));

                  return function (_x9) {
                    return _ref5.apply(this, arguments);
                  };
                }());

              case 6:
                _context6.next = 12;
                break;

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6['catch'](2);

                this.logger.error(_context6.t0);
                res.status(400).send(_context6.t0);

              case 12:
                _context6.next = 16;
                break;

              case 14:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 16:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[2, 8]]);
      }));

      function create(_x7, _x8) {
        return _ref4.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: 'update',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
        var _this2 = this;

        var id, validation, updateSet;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                id = req.params.id;
                validation = _joi2.default.validate(req.query, _Contract2.default.updateParams);

                if (!(validation.error === null)) {
                  _context9.next = 16;
                  break;
                }

                _context9.prev = 3;
                updateSet = {
                  status: req.query.status,
                  enactedOn: FieldValue.serverTimestamp()
                };

                if (req.query.isFeePaid) {
                  updateSet = Object.assign(updateSet, { isFeePaid: true });
                }
                _context9.next = 8;
                return this.contracts.doc(id).update(updateSet).then(function () {
                  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(doc) {
                    var errorMessage;
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            if (!doc._writeTime) {
                              _context8.next = 5;
                              break;
                            }

                            _context8.next = 3;
                            return _this2.contracts.doc(id).get().then(function () {
                              var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(doc2) {
                                var newContract;
                                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                                  while (1) {
                                    switch (_context7.prev = _context7.next) {
                                      case 0:
                                        newContract = doc2.data();
                                        _context7.next = 3;
                                        return _this2.notifyPartiesAboutContractAccept(newContract);

                                      case 3:
                                        res.status(200).send(newContract);

                                      case 4:
                                      case 'end':
                                        return _context7.stop();
                                    }
                                  }
                                }, _callee7, _this2);
                              }));

                              return function (_x14) {
                                return _ref9.apply(this, arguments);
                              };
                            }());

                          case 3:
                            _context8.next = 8;
                            break;

                          case 5:
                            errorMessage = 'Failed to write update to contract.';

                            _this2.logger.error(errorMessage);
                            res.status(400).send(errorMessage);

                          case 8:
                          case 'end':
                            return _context8.stop();
                        }
                      }
                    }, _callee8, _this2);
                  }));

                  return function (_x13) {
                    return _ref8.apply(this, arguments);
                  };
                }());

              case 8:
                _context9.next = 14;
                break;

              case 10:
                _context9.prev = 10;
                _context9.t0 = _context9['catch'](3);

                this.logger.error(_context9.t0);
                res.status(400).send(_context9.t0);

              case 14:
                _context9.next = 18;
                break;

              case 16:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 18:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[3, 10]]);
      }));

      function update(_x11, _x12) {
        return _ref7.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'updateTeamAccount',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(contract, teamAccount) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.accounts.doc(contract.teamUid).collection('transactions').add({
                  activityType: 'Player contract bid sent to ' + contract.playerName,
                  timestamp: FieldValue.serverTimestamp(),
                  amount: contract.purchasePrice
                });

              case 2:
                _context10.next = 4;
                return this.accounts.doc(contract.teamUid).update({
                  availableBudget: teamAccount.availableBudget - contract.purchasePrice
                });

              case 4:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function updateTeamAccount(_x15, _x16) {
        return _ref10.apply(this, arguments);
      }

      return updateTeamAccount;
    }()
  }, {
    key: 'returnTeamAvailableBudget',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(teamUid, amount) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                _context12.next = 3;
                return this.accounts.doc(teamUid).get().then(function () {
                  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(doc) {
                    var teamAccount;
                    return regeneratorRuntime.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            teamAccount = doc.data();
                            _context11.next = 3;
                            return _this3.accounts.doc(teamUid).update({
                              availableBudget: teamAccount.availableBudget + amount
                            });

                          case 3:
                          case 'end':
                            return _context11.stop();
                        }
                      }
                    }, _callee11, _this3);
                  }));

                  return function (_x19) {
                    return _ref12.apply(this, arguments);
                  };
                }());

              case 3:
                _context12.next = 8;
                break;

              case 5:
                _context12.prev = 5;
                _context12.t0 = _context12['catch'](0);

                this.logger.error(_context12.t0);

              case 8:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this, [[0, 5]]);
      }));

      function returnTeamAvailableBudget(_x17, _x18) {
        return _ref11.apply(this, arguments);
      }

      return returnTeamAvailableBudget;
    }()
  }, {
    key: 'notifyPartiesAboutContractAccept',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(newContract) {
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (!(newContract.status === 'accepted')) {
                  _context13.next = 7;
                  break;
                }

                _context13.next = 3;
                return this.accounts.doc(newContract.playerUid).collection('transactions').add({
                  activityType: newContract.playerName + ' accepted a contract bid from ' + newContract.teamName,
                  amount: newContract.purchasePrice,
                  timestamp: FieldValue.serverTimestamp()
                });

              case 3:
                _context13.next = 5;
                return this.accounts.doc(newContract.teamUid).collection('transactions').add({
                  activityType: newContract.playerName + ' accepted a contract bid from ' + newContract.teamName,
                  amount: newContract.purchasePrice,
                  timestamp: FieldValue.serverTimestamp()
                });

              case 5:
                _context13.next = 25;
                break;

              case 7:
                if (!(newContract.status === 'rejected')) {
                  _context13.next = 14;
                  break;
                }

                _context13.next = 10;
                return this.accounts.doc(newContract.playerUid).collection('transactions').add({
                  activityType: newContract.playerName + ' rejected a contract bid from ' + newContract.teamName,
                  amount: newContract.purchasePrice,
                  timestamp: FieldValue.serverTimestamp()
                });

              case 10:
                _context13.next = 12;
                return this.accounts.doc(newContract.teamUid).collection('transactions').add({
                  activityType: newContract.playerName + ' rejected a contract bid from ' + newContract.teamName,
                  amount: newContract.purchasePrice,
                  timestamp: FieldValue.serverTimestamp()
                });

              case 12:
                _context13.next = 25;
                break;

              case 14:
                if (!(newContract.status === 'active')) {
                  _context13.next = 25;
                  break;
                }

                _context13.next = 17;
                return this.accounts.doc(newContract.playerUid).collection('transactions').add({
                  activityType: newContract.playerName + '\'s contract is active for ' + newContract.teamName + '!',
                  amount: newContract.purchasePrice,
                  timestamp: FieldValue.serverTimestamp()
                });

              case 17:
                _context13.next = 19;
                return this.accounts.doc(newContract.teamUid).collection('transactions').add({
                  activityType: newContract.playerName + '\'s contract is active for ' + newContract.teamName + '!',
                  amount: newContract.purchasePrice,
                  timestamp: FieldValue.serverTimestamp()
                });

              case 19:
                _context13.next = 21;
                return this.addPlayerSigningBonus(newContract);

              case 21:
                _context13.next = 23;
                return this.updatePlayerEntityWithContract(newContract);

              case 23:
                _context13.next = 25;
                return this.updateTeamPotentialBudget(newContract);

              case 25:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function notifyPartiesAboutContractAccept(_x20) {
        return _ref13.apply(this, arguments);
      }

      return notifyPartiesAboutContractAccept;
    }()
  }, {
    key: 'addPlayerSigningBonus',
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(newContract) {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this.accounts.doc(newContract.playerUid).update({
                  totalBalance: newContract.purchasePrice * .2
                });

              case 2:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function addPlayerSigningBonus(_x21) {
        return _ref14.apply(this, arguments);
      }

      return addPlayerSigningBonus;
    }()
  }, {
    key: 'updateTeamPotentialBudget',
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(newContract) {
        var teamAccount;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.accounts.doc(newContract.teamUid).get().then(function (doc) {
                  return doc.data();
                });

              case 2:
                teamAccount = _context15.sent;
                _context15.next = 5;
                return this.accounts.doc(newContract.teamUid).update({
                  potentialBudget: teamAccount.potentialBudget - newContract.purchasePrice
                });

              case 5:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function updateTeamPotentialBudget(_x22) {
        return _ref15.apply(this, arguments);
      }

      return updateTeamPotentialBudget;
    }()
  }, {
    key: 'updatePlayerTransactions',
    value: function () {
      var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(playerUid, contract) {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0;
                _context16.next = 3;
                return this.accounts.doc(playerUid).collection('transactions').add({
                  activityType: 'Contract bid from ' + contract.teamName + ' was deleted by admin',
                  amount: 0,
                  timestamp: FieldValue.serverTimestamp()
                });

              case 3:
                _context16.next = 8;
                break;

              case 5:
                _context16.prev = 5;
                _context16.t0 = _context16['catch'](0);

                this.logger.error(_context16.t0);

              case 8:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this, [[0, 5]]);
      }));

      function updatePlayerTransactions(_x23, _x24) {
        return _ref16.apply(this, arguments);
      }

      return updatePlayerTransactions;
    }()
  }, {
    key: 'updatePlayerEntityWithContract',
    value: function () {
      var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(newContract) {
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return this.players.doc(newContract.playerUid).update({
                  contractUid: newContract.contractUid,
                  teamUid: newContract.teamUid
                });

              case 2:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function updatePlayerEntityWithContract(_x25) {
        return _ref17.apply(this, arguments);
      }

      return updatePlayerEntityWithContract;
    }()
  }, {
    key: 'updateTeamAccountTransactions',
    value: function () {
      var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(teamUid, contract) {
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.prev = 0;
                _context18.next = 3;
                return this.accounts.doc(teamUid).collection('transactions').add({
                  activityType: 'Contract bid to ' + contract.playerName + ' was deleted by admin',
                  amount: 0,
                  timestamp: FieldValue.serverTimestamp()
                });

              case 3:
                _context18.next = 5;
                return this.accounts.doc(teamUid).collection('transactions').add({
                  activityType: 'Funds for ' + contract.playerName + ' failed contract bid returned to Available budget',
                  amount: contract.purchasePrice,
                  timestamp: FieldValue.serverTimestamp()
                });

              case 5:
                _context18.next = 10;
                break;

              case 7:
                _context18.prev = 7;
                _context18.t0 = _context18['catch'](0);

                this.logger.error(_context18.t0);

              case 10:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[0, 7]]);
      }));

      function updateTeamAccountTransactions(_x26, _x27) {
        return _ref18.apply(this, arguments);
      }

      return updateTeamAccountTransactions;
    }()
  }]);

  return ContractController;
}();

exports.default = ContractController;
//# sourceMappingURL=contractController.js.map