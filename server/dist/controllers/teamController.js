'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //third party


//internal


var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _Team = require('../models/Team.js');

var _Team2 = _interopRequireDefault(_Team);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TeamController = function () {
  function TeamController(db, logger) {
    _classCallCheck(this, TeamController);

    this.teams = db.collection('teams');
    this.logger = logger;
  }

  _createClass(TeamController, [{
    key: 'list',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var validation;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                validation = _joi2.default.validate(req.params, _Team2.default.listParams);

                if (!(validation.error === null)) {
                  _context.next = 13;
                  break;
                }

                _context.prev = 2;
                _context.next = 5;
                return this.teams.get().then(function (snapshot) {
                  var teams = [];
                  snapshot.forEach(function (doc) {
                    teams.push(doc.data());
                  });
                  if (teams.length > -1) {
                    res.status(200).send(teams);
                  } else {
                    throw {
                      name: 'NoTeamsExist',
                      message: 'There were no teams found in the database for this query!'
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
    key: 'listOne',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var validation;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                validation = _joi2.default.validate(req.params, _Team2.default.listOneParams);

                if (!(validation.error === null)) {
                  _context2.next = 13;
                  break;
                }

                _context2.prev = 2;
                _context2.next = 5;
                return this.teams.doc(req.params.id).get().then(function (doc) {
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
  }]);

  return TeamController;
}();

exports.default = TeamController;
//# sourceMappingURL=teamController.js.map