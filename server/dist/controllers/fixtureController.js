'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //third party


//internal


var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _Fixture = require('../models/Fixture.js');

var _Fixture2 = _interopRequireDefault(_Fixture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FixtureController = function () {
  function FixtureController(db, logger) {
    _classCallCheck(this, FixtureController);

    this.fixtures = db.collection('fixtures');
    this.events = db.collection('events');
    this.logger = logger;
  }

  _createClass(FixtureController, [{
    key: 'list',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var _validation, searchValidation;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(Object.keys(req.query).length === 0 && obj.constructor === Object)) {
                  _context.next = 18;
                  break;
                }

                _validation = _joi2.default.validate(req.params, _Fixture2.default.listParams);

                if (!(_validation.error === null)) {
                  _context.next = 14;
                  break;
                }

                _context.prev = 3;
                _context.next = 6;
                return this.fixtures.get().then(function (snapshot) {
                  var fixtures = [];
                  snapshot.forEach(function (doc) {
                    fixtures.push(doc.data());
                  });
                  if (fixtures.length > -1) {
                    res.status(200).send(fixtures);
                  } else {
                    throw {
                      name: 'NoFixturesExist',
                      message: 'There were no fixtures found in the database for this query!'
                    };
                  }
                });

              case 6:
                _context.next = 12;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](3);

                this.logger.error(_context.t0);
                res.status(400).send(_context.t0);

              case 12:
                _context.next = 16;
                break;

              case 14:
                this.logger.error('Joi validation error: ' + _validation.error);
                res.status(400).send(_validation.error);

              case 16:
                _context.next = 34;
                break;

              case 18:
                //we are searching for fixtures by criteria
                console.log(req.query);
                searchValidation = _joi2.default.validate(req.query, _Fixture2.default.listSearchParams);

                if (!(searchValidation.error === null)) {
                  _context.next = 32;
                  break;
                }

                _context.prev = 21;
                _context.next = 24;
                return this.fixtures.where(req.query.queryProp, '==', req.query.queryVal).get().then(function (snapshot) {
                  var fixtures = [];
                  snapshot.forEach(function (doc) {
                    fixtures.push(doc.data());
                  });
                  if (fixtures.length > -1) {
                    res.status(200).send(fixtures);
                  } else {
                    throw {
                      name: 'NoFixturesExist',
                      message: 'There were no fixtures found in the database for this query!'
                    };
                  }
                });

              case 24:
                _context.next = 30;
                break;

              case 26:
                _context.prev = 26;
                _context.t1 = _context['catch'](21);

                this.logger.error(_context.t1);
                res.status(400).send(_context.t1);

              case 30:
                _context.next = 34;
                break;

              case 32:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 34:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 8], [21, 26]]);
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
        var validation, fixtureData;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                validation = _joi2.default.validate(req.params, _Fixture2.default.listOneParams);

                if (!(validation.error === null)) {
                  _context2.next = 17;
                  break;
                }

                _context2.prev = 2;
                fixtureData = {};
                _context2.next = 6;
                return this.fixtures.doc(req.params.id).get().then(function (doc) {
                  fixtureData.fixtureInfo = doc.data();
                });

              case 6:
                _context2.next = 8;
                return this.events.where('fixtureId', '==', req.params.id).get().then(function (snapshot) {
                  var events = [];
                  snapshot.forEach(function (doc) {
                    events.push(doc.data());
                  });
                  if (events.length > -1) {
                    fixtureData.events = events;
                  } else {
                    throw {
                      name: 'NoEventsExist',
                      message: 'There were no events found in the database for this fixture!'
                    };
                  }
                });

              case 8:
                res.status(200).send(fixtureData);
                _context2.next = 15;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2['catch'](2);

                this.logger.error(_context2.t0);
                res.status(400).send(_context2.t0);

              case 15:
                _context2.next = 19;
                break;

              case 17:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 19:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 11]]);
      }));

      function listOne(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return listOne;
    }()
  }]);

  return FixtureController;
}();

exports.default = FixtureController;
//# sourceMappingURL=fixtureController.js.map