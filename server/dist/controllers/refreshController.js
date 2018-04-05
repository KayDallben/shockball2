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

var _Refresh = require('../models/Refresh.js');

var _Refresh2 = _interopRequireDefault(_Refresh);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RefreshController = function () {
  function RefreshController(db, logger) {
    _classCallCheck(this, RefreshController);

    this.tokens = db.collection('tokens');
    this.logger = logger;
  }

  _createClass(RefreshController, [{
    key: 'listOne',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var _this = this;

        var validation;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                validation = _joi2.default.validate(req.query, _Refresh2.default.listOneParams);

                if (!(validation.error === null)) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 4;
                return this.tokens.where('access_token', '==', req.query.access_token).get().then(function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(snapshot) {
                    var userTokenObjects, userTokenObject, newTokenInfo, expiresAtMinutes, newToken, safeTokenInfo;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            userTokenObjects = [];

                            snapshot.forEach(function (doc) {
                              userTokenObjects.push(doc.data());
                            });
                            userTokenObject = userTokenObjects[0];
                            _context.prev = 3;
                            _context.next = 6;
                            return swcApi.refreshAccessToken(userTokenObject.refresh_token);

                          case 6:
                            newTokenInfo = _context.sent;
                            expiresAtMinutes = (newTokenInfo.data.expires_in - 120) / 60;
                            _context.next = 10;
                            return _this.tokens.add({
                              access_token: newTokenInfo.data.access_token,
                              refresh_token: newTokenInfo.data.refresh_token,
                              expires_at: _this.dateWithAddedMinutes(expiresAtMinutes),
                              created_at: new Date()
                            });

                          case 10:
                            newToken = _context.sent;
                            _context.next = 13;
                            return _this.tokens.doc(newToken.id).update({
                              uid: newToken.id
                            });

                          case 13:
                            safeTokenInfo = {
                              access_token: newTokenInfo.data.access_token,
                              expires_at: _this.dateWithAddedMinutes(expiresAtMinutes)
                            };

                            res.status(200).send(safeTokenInfo);
                            _context.next = 21;
                            break;

                          case 17:
                            _context.prev = 17;
                            _context.t0 = _context['catch'](3);

                            _this.logger.error(_context.t0);
                            res.status(200).send(userTokenObject);

                          case 21:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this, [[3, 17]]);
                  }));

                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 4:
                _context2.next = 8;
                break;

              case 6:
                this.logger.error('Joi validation error: ' + validation.error);
                res.status(400).send(validation.error);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
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

  return RefreshController;
}();

exports.default = RefreshController;
//# sourceMappingURL=refreshController.js.map