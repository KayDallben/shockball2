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
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var validation, updateSet, newContract;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                validation = _joi2.default.validate(req.body, _Contract2.default.create);

                if (!(validation.error === null)) {
                  _context3.next = 19;
                  break;
                }

                _context3.prev = 2;
                updateSet = req.body;
                _context3.next = 6;
                return this.contracts.add(updateSet);

              case 6:
                newContract = _context3.sent;
                _context3.next = 9;
                return newContract.update({
                  contractUid: newContract.id,
                  created: FieldValue.serverTimestamp(),
                  lastModified: FieldValue.serverTimestamp()
                });

              case 9:
                _context3.next = 11;
                return this.contracts.doc(newContract.id).get().then(function (doc) {
                  res.status(201).send(doc.data());
                });

              case 11:
                _context3.next = 17;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3['catch'](2);

                this.logger.error(_context3.t0);
                res.status(400).send(_context3.t0);

              case 17:
                _context3.next = 21;
                break;

              case 19:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 21:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 13]]);
      }));

      function create(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return create;
    }()
  }]);

  return ContractController;
}();

exports.default = ContractController;
//# sourceMappingURL=contractController.js.map