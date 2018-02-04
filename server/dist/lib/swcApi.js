'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAccessToken = exports.getPlayerUid = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//third party
if (!process.env.FIREBASE_DATABASE_URL) {
  var serviceAccount = require('../../../firebase-security.json'); //eslint-disable-line no-unused-vars
}
if (!process.env.SWC_CLIENT_SECRET) {
  var swcSecurity = require('../../../swc-security.json');
  process.env.SWC_CLIENT_SECRET = swcSecurity.swc_client_secret;
  process.env.SWC_CLIENT_ID = swcSecurity.swc_client_id;
  process.env.SWC_REDIRECT_URI = swcSecurity.swc_redirect_uri;
}

function getPlayerUid(token) {
  return _axios2.default.get('http://www.swcombine.com/ws/v1.0/character/?access_token=' + token, {
    headers: {
      'Accept': 'application/json'
    }
  }).then(function (response) {
    return response;
  }).catch(function (error) {
    var swcError = new Error(error.message);
    return swcError;
  });
}

function getAccessToken(authCode) {
  return (0, _axios2.default)({
    url: 'http://www.swcombine.com/ws/oauth2/token/',
    method: 'POST',
    data: _qs2.default.stringify({
      code: authCode,
      client_id: process.env.SWC_CLIENT_ID,
      client_secret: process.env.SWC_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.SWC_REDIRECT_URI,
      access_type: 'offline'
    }),
    headers: {
      'Accept': 'application/json'
    }
  }).then(function (response) {
    return response;
  }).catch(function (error) {
    var swcError = new Error(error.message);
    return swcError;
  });
}

exports.getPlayerUid = getPlayerUid;
exports.getAccessToken = getAccessToken;
//# sourceMappingURL=swcApi.js.map