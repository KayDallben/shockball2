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
  var playerController = new ProfileController(db, logger);

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
   * /players:
   *   x-swagger-router-controller: ../controllers/playerController
   *   get:
   *     tags:
   *       - Players
   *     description: Get a list of players
   *     operationId: list
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Player"
   *       400:
   *         description: Bad request
   */
  playerRoutes.get('/', _authCheck2.default, function (req, res) {
    playerController.list(req, res);
  });

  /**
   * @swagger
   * /players/{id}:
   *   x-swagger-router-controller: ../controllers/playersController
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
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Player"
   */
  playerRoutes.get('/:id', _authCheck2.default, function (req, res) {
    playerController.listOne(req, res);
  });

  return playerRoutes;
};
//# sourceMappingURL=players.js.map