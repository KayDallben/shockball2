'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //third party


//internal


var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _swcApi = require('../lib/swcApi');

var swcApi = _interopRequireWildcard(_swcApi);

var _Login = require('../models/Login.js');

var _Login2 = _interopRequireDefault(_Login);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginController = function () {
  function LoginController(db, logger) {
    _classCallCheck(this, LoginController);

    this.tokens = db.collection('tokens');
    this.logger = logger;
  }

  _createClass(LoginController, [{
    key: 'listOne',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var validation, tokenInfo, expiresAtMinutes, newToken, safeTokenInfo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                validation = _joi2.default.validate(req.query, _Login2.default.listOneParams);

                if (!(validation.error === null)) {
                  _context.next = 22;
                  break;
                }

                _context.prev = 2;
                _context.next = 5;
                return swcApi.getAccessToken(req.query.authorization_code);

              case 5:
                tokenInfo = _context.sent;
                expiresAtMinutes = (tokenInfo.data.expires_in - 120) / 60;
                _context.next = 9;
                return this.tokens.add({
                  access_token: tokenInfo.data.access_token,
                  refresh_token: tokenInfo.data.refresh_token,
                  expires_at: this.dateWithAddedMinutes(expiresAtMinutes),
                  created_at: new Date()
                });

              case 9:
                newToken = _context.sent;
                _context.next = 12;
                return this.tokens.doc(newToken.id).update({
                  uid: newToken.id
                });

              case 12:
                safeTokenInfo = {
                  access_token: tokenInfo.data.access_token,
                  expires_at: this.dateWithAddedMinutes(expiresAtMinutes)
                };

                res.status(200).send(safeTokenInfo);
                _context.next = 20;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context['catch'](2);

                this.logger.error(_context.t0);
                res.status(400).send('Error creating new player in database');

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
    key: 'dateWithAddedMinutes',
    value: function dateWithAddedMinutes(minutes) {
      return new Date(new Date().getTime() + minutes * 60000);
    }
  }]);

  return LoginController;
}();

exports.default = LoginController;
//# sourceMappingURL=loginController.js.map