'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  listParams: _joi2.default.object().keys(),
  listSearchParams: _joi2.default.object().keys({
    queryProp: _joi2.default.string(),
    queryVal: _joi2.default.string()
  }),
  listOneParams: _joi2.default.object().keys({
    id: _joi2.default.string().required()
  }),
  updateParams: _joi2.default.object().keys({
    regimen: {
      value: _joi2.default.string().required(),
      label: _joi2.default.string().required()
    },
    access_token: _joi2.default.string().required()
  })
};
//# sourceMappingURL=Player.js.map