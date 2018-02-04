'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _authCheck = require('../lib/authCheck');

var _authCheck2 = _interopRequireDefault(_authCheck);

var _profileController = require('../controllers/profileController');

var _profileController2 = _interopRequireDefault(_profileController);

var _loginController = require('../controllers/loginController');

var _loginController2 = _interopRequireDefault(_loginController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = (0, _express.Router)();

// Internal code/packages
//third party libraries

exports.default = function (db, logger) {
  var profileController = new _profileController2.default(db, logger);
  var loginController = new _loginController2.default(logger);

  /**
   * @swagger
   * definitions:
   *   Profile:
   *     properties:
   *       access_token:
   *         type: "string"
   *   Login:
   *     properties:
   *       authorization_code:
   *         type: "string"
   */

  /**
   * @swagger
   * /api/profile:
   *   x-swagger-router-controller: ../controllers/profileController
   *   get:
   *     tags:
   *       - Profile
   *     description: Get the profile data for the current player. Returns a Player object. Creates a new Player if user is new.
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - access_token: access token
   *         description: SWC access token of the current user
   *         in: query
   *         name: access_token
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Profile'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Profile"
   */
  routes.get('/profile', _authCheck2.default, function (req, res) {
    profileController.listOne(req, res);
  });

  /**
  * @swagger
  * /api/login:
  *   x-swagger-router-controller: ../controllers/loginController
  *   get:
  *     tags:
  *       - Login
  *     description: Login the user and get player access token from SWC api
  *     operationId: listOne
  *     produces:
  *       - application/json
  *     parameters:
  *       - authorization_code: authorization code
  *         description: SWC authorization code of the current user
  *         in: query
  *         name: authorization_code
  *         required: true
  *         schema:
  *           $ref: '#/definitions/Login'
  *     responses:
  *       200:
  *         description: Success
  *         schema:
  *           $ref: "#/definitions/Login"
  */
  routes.get('/login', function (req, res) {
    loginController.listOne(req, res);
  });

  return routes;
};
//# sourceMappingURL=routes.js.map