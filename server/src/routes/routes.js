//third party libraries
import { Router } from 'express'
const routes = Router()

// Internal code/packages
import authCheck from '../lib/authCheck'
import ProfileController from '../controllers/profileController'
import LoginController from '../controllers/loginController'
import TeamController from '../controllers/teamController'
import FixtureController from '../controllers/fixtureController'

export default (db, logger) => {
  const profileController = new ProfileController(db, logger)
  const loginController = new LoginController(logger)
  const teamController = new TeamController(db, logger)
  const fixtureController = new FixtureController(db, logger)

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

  return routes
}
