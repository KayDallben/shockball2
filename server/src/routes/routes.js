//third party libraries
import { Router } from 'express'
const routes = Router()

// Internal code/packages
import authCheck from '../lib/authCheck'
import ProfileController from '../controllers/profileController'
import LoginController from '../controllers/loginController'
import TeamController from '../controllers/teamController'
import FixtureController from '../controllers/fixtureController'
import PlayerController from '../controllers/playerController'

export default (db, logger) => {
  const profileController = new ProfileController(db, logger)
  const loginController = new LoginController(logger)
  const teamController = new TeamController(db, logger)
  const fixtureController = new FixtureController(db, logger)
  const playerController = new PlayerController(db, logger)

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
   *   Team:
   *     properties:
   *       teamName:
   *         type: "string"
   *       teamPicUrl:
   *         type: "string"
   *       teamVenue:
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
  routes.get('/profile', authCheck, (req, res) => {
    profileController.listOne(req, res)
  })

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
  routes.get('/login', (req, res) => {
    loginController.listOne(req, res)
  })
/**
   * @swagger
   * /api/teams:
   *   x-swagger-router-controller: ../controllers/teamController
   *   get:
   *     tags:
   *       - Team
   *     description: Get all teams
   *     operationId: list
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Team"
   */
  routes.get('/teams', authCheck, (req, res) => {
    teamController.list(req, res)
  })
    /**
   * @swagger
   * /api/teams/{id}:
   *   x-swagger-router-controller: ../controllers/teamController
   *   get:
   *     tags:
   *       - Team
   *     description: Get team by id
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: id
   *         description: team's id
   *         in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Team'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Team"
   */
  routes.get('/teams/:id', authCheck, (req, res) => {
    teamController.listOne(req, res)
  })

  /**
   * @swagger
   * /api/fixtures:
   *   x-swagger-router-controller: ../controllers/fixtureController
   *   get:
   *     tags:
   *       - Fixture
   *     description: Get all fixtures
   *     operationId: list
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Fixture"
   */
  routes.get('/fixtures', authCheck, (req, res) => {
    fixtureController.list(req, res)
  })
  /**
   * @swagger
   * /api/fixtures/{id}:
   *   x-swagger-router-controller: ../controllers/fixtureController
   *   get:
   *     tags:
   *       - Fixture
   *     description: Get fixture by id
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: id
   *         description: fixture's id
   *         in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Fixture'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Fixture"
   */
  routes.get('/fixtures/:id', authCheck, (req, res) => {
    fixtureController.listOne(req, res)
  })
  /**
   * @swagger
   * /api/players:
   *   x-swagger-router-controller: ../controllers/playerController
   *   get:
   *     tags:
   *       - Player
   *     description: Get all players
   *     operationId: list
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Player"
   */
  routes.get('/players', authCheck, (req, res) => {
    playerController.list(req, res)
  })
  /**
   * @swagger
   * /api/players/{id}:
   *   x-swagger-router-controller: ../controllers/playerController
   *   get:
   *     tags:
   *       - Player
   *     description: Get player by id
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: id
   *         description: player's id
   *         in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Player'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Player"
   */
  routes.get('/players/:id', authCheck, (req, res) => {
    playerController.listOne(req, res)
  })

  /**
   * @swagger
   * /api/players/{id}:
   *   x-swagger-router-controller: ../controllers/playerController
   *   put:
   *     tags:
   *       - Player
   *     description: Updates a Player
   *     operationId: update
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: id
   *         description: player's id
   *         in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Player'
   *       - name: regimen
   *         description: Object with value and label string properties indicating what skill to train
   *         in: query
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Player'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Player"
   */
  routes.put('/players/:id', authCheck, (req, res) => {
    playerController.update(req, res)
  })

  return routes
}
