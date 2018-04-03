'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  listParams: _joi2.default.object().keys({
    queryProp: _joi2.default.string().required(),
    queryVal: _joi2.default.string().required(),
    access_token: _joi2.default.string().required()
  }),
  listOneParams: _joi2.default.object().keys({
    id: _joi2.default.string().required()
  }),
  create: _joi2.default.object().keys({
    playerName: _joi2.default.string().required(),
    playerUid: _joi2.default.string().required(),
    purchasePrice: _joi2.default.number().required(),
    salary: _joi2.default.number().required(),
    games: _joi2.default.number().required(),
    status: _joi2.default.string().required(),
    teamName: _joi2.default.string().required(),
    teamUid: _joi2.default.string().required(),
    isFeePaid: _joi2.default.boolean().required()
  }),
  updateParams: _joi2.default.object().keys({
    status: _joi2.default.string().required(),
    access_token: _joi2.default.string().required(),
    isFeePaid: _joi2.default.boolean()
  }),
  removeParams: _joi2.default.object().keys({
    access_token: _joi2.default.string().required(),
    swcUid: _joi2.default.string().required()
  })
};
//# sourceMappingURL=Contract.js.map