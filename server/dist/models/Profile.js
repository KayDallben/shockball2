'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  listParams: _joi2.default.object().keys({}),
  listOneParams: _joi2.default.object().keys({
    access_token: _joi2.default.string().required()
  })
};
//# sourceMappingURL=Profile.js.map