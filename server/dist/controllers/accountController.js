'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //third party


//internal


var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _Account = require('../models/Account.js');

var _Account2 = _interopRequireDefault(_Account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccountController = function () {
  function AccountController(db, logger) {
    _classCallCheck(this, AccountController);

    this.accounts = db.collection('accounts');
    this.logger = logger;
  }

  _createClass(AccountController, [{
    key: 'listOne',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var _this = this;

        var validation;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                validation = _joi2.default.validate(req.params, _Account2.default.listOneParams);

                if (!(validation.error === null)) {
                  _context2.next = 13;
                  break;
                }

                _context2.prev = 2;
                _context2.next = 5;
                return this.accounts.doc(req.params.id).get().then(function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(doc) {
                    var userAccount;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            userAccount = doc.data();

                            userAccount.transactions = [];
                            _context.next = 4;
                            return _this.accounts.doc(req.params.id).getCollections().then(function (collections) {
                              if (collections.length > 0) {
                                collections.forEach(function (collection) {
                                  collection.get().then(function (snapshot) {
                                    snapshot.forEach(function (doc2) {
                                      userAccount.transactions.push(doc2.data());
                                    });
                                    res.status(200).send(userAccount);
                                  });
                                });
                              } else {
                                //transactions collection doesn't exist
                                userAccount.transactions = [];
                                res.status(200).send(userAccount);
                              }
                            });

                          case 4:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this);
                  }));

                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }());

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

      function listOne(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return listOne;
    }()
  }, {
    key: 'list',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var validation;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                validation = _joi2.default.validate(req.params, _Account2.default.listParams);

                if (!(validation.error === null)) {
                  _context3.next = 13;
                  break;
                }

                _context3.prev = 2;
                _context3.next = 5;
                return this.accounts.get().then(function (snapshot) {
                  var accounts = [];
                  snapshot.forEach(function (doc) {
                    accounts.push(doc.data());
                  });
                  if (accounts.length > -1) {
                    res.status(200).send(accounts);
                  } else {
                    throw {
                      name: 'NoAccountsExist',
                      message: 'There were no accounts found in the database for this query!'
                    };
                  }
                });

              case 5:
                _context3.next = 11;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3['catch'](2);

                this.logger.error(_context3.t0);
                res.status(400).send(_context3.t0);

              case 11:
                _context3.next = 15;
                break;

              case 13:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 15:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 7]]);
      }));

      function list(_x4, _x5) {
        return _ref3.apply(this, arguments);
      }

      return list;
    }()
  }]);

  return AccountController;
}();

exports.default = AccountController;
//# sourceMappingURL=accountController.js.map