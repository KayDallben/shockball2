'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _authCheck = require('../lib/authCheck');

var _authCheck2 = _interopRequireDefault(_authCheck);

var _playerController = require('../controllers/playerController');

var _playerController2 = _interopRequireDefault(_playerController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playerRoutes = (0, _express.Router)();

// Internal code/packages
//third party libraries

exports.default = function (db, logger) {
  var playerController = new _playerController2.default(db, logger);

  /**
   * @swagger
   * definitions:
   *   Player:
   *     properties:
   *       created:
   *         type: "string"
   *       createdAsUid:
   *         type: "string"
   *       gender:
   *         type: "string"
   *       image:
   *         type: "string"
   *       name:
   *         type: "string"
   *       race:
   *         type: string"
   *       passing:
   *         type: "number"
   *       blocking:
   *         type: "number"
   *       throwing:
   *         type: "number"
   *       tougness:
   *         type: "number"
   *       vision:
   *         type: "number"
   *       endurance:
   *         type: "number"
   *       leadership:
   *         type: "number"
   *       morale:
   *         type: "number"
   *       fatigue:
   *         type: "number"
   *       aggression:
   *         type: "number"
   */

  /**
   * @swagger
   * /api/players:
   *   x-swagger-router-controller: ../controllers/playerController
   *   get:
   *     tags:
   *       - Players
   *     description: Get a list of players
   *     operationId: list
   *     produces:
   *       - application/json
   *     parameters:
   *       - access_token: access token
   *         description: SWC access token of the current user
   *         in: query
   *         name: access_token
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Player'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Player"
   *       400:
   *         description: Bad request
   */
  playerRoutes.get('/players', _authCheck2.default, function (req, res) {
    playerController.list(req, res);
  });

  /**
   * @swagger
   * /api/players/{id}:
   *   x-swagger-router-controller: ../controllers/playerController
   *   get:
   *     tags:
   *       - Players
   *     description: Get a single player by uid
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - uid: player uid
   *         description: UID of the player
   *         in: path
   *         name: uid
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Player'
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
   *           $ref: "#/definitions/Player"
   */
  playerRoutes.get('/players/:id', _authCheck2.default, function (req, res) {
    playerController.listOne(req, res);
  });

  return playerRoutes;
};
//# sourceMappingURL=playerRoutes.js.map