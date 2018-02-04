'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  listOneParams: _joi2.default.object().keys({
    authorization_code: _joi2.default.string().required()
  })
};
//# sourceMappingURL=Login.js.map