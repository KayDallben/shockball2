//third party libraries
import { Router } from 'express'
const routes = Router()

// Internal code/packages
import authCheck from '../lib/authCheck'
import ProfileController from '../controllers/profileController'
import LoginController from '../controllers/loginController'
import RefreshController from '../controllers/refreshController'
import TeamController from '../controllers/teamController'
import FixtureController from '../controllers/fixtureController'
import PlayerController from '../controllers/playerController'
import AccountController from '../controllers/accountController'
import ContractController from '../controllers/contractController'

export default (db, logger) => {
  const profileController = new ProfileController(db, logger)
  const loginController = new LoginController(db, logger)
  const refreshController = new RefreshController(db, logger)
  const teamController = new TeamController(db, logger)
  const fixtureController = new FixtureController(db, logger)
  const playerController = new PlayerController(db, logger)
  const accountController = new AccountController(db, logger)
  const contractController = new ContractController(db, logger)

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
   * /api/refresh:
   *   x-swagger-router-controller: ../controllers/refreshController
   *   get:
   *     tags:
   *       - Refresh
   *     description: Get a new access_token and refresh_token from SWC api
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - access_token: access_token
   *         description: SWC access token of the current user
   *         in: query
   *         name: access_token
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Refresh'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Refresh"
   */
  routes.get('/refresh', (req, res) => {
    refreshController.listOne(req, res)
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

  /**
   * @swagger
   * /api/accounts/{id}:
   *   x-swagger-router-controller: ../controllers/accountController
   *   get:
   *     tags:
   *       - Account
   *     description: Get account by id
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: id
   *         description: player's account id
   *         in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Account'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Account"
   */
  routes.get('/accounts/:id', authCheck, (req, res) => {
    accountController.listOne(req, res)
  })

  /**
   * @swagger
   * /api/contracts:
   *   x-swagger-router-controller: ../controllers/contractController
   *   get:
   *     tags:
   *       - Contract
   *     description: Get all contracts
   *     operationId: list
   *     produces:
   *       - application/json
   *     parameters:
   *       - queryProp: contract property to query by
   *         description: contract property to query by
   *         in: query
   *         name: queryProp
   *         required: false
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - queryVal: contract property value to query by
   *         description: contract property value to query by
   *         in: query
   *         name: queryVal
   *         required: false
   *         schema:
   *           $ref: '#/definitions/Contract'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Contract"
   */
  routes.get('/contracts', authCheck, (req, res) => {
    contractController.list(req, res)
  })
  /**
   * @swagger
   * /api/contracts/{id}:
   *   x-swagger-router-controller: ../controllers/contractController
   *   get:
   *     tags:
   *       - Contract
   *     description: Get contract by id
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: id
   *         description: contract's id
   *         in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Contract"
   */
  routes.get('/contracts/:id', authCheck, (req, res) => {
    contractController.listOne(req, res)
  })

  /**
   * @swagger
   * /api/contracts/{id}:
   *   x-swagger-router-controller: ../controllers/contractController
   *   get:
   *     tags:
   *       - Contract
   *     description: Delete contract by id
   *     operationId: remove
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: id
   *         description: contract's id
   *         in: query
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Contract"
   */
  routes.delete('/contracts/:id', authCheck, (req, res) => {
    contractController.remove(req, res)
  })

  /**
   * @swagger
   * /api/contracts:
   *   x-swagger-router-controller: ../controllers/contractController
   *   post:
   *     tags:
   *       - Contract
   *     description: Creates a new Contract
   *     operationId: create
   *     produces:
   *       - application/json
   *     parameters:
   *       - games: number of games committed to by player
   *         description: number of games committed to by player
   *         in: query
   *         name: games
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - salary: player's salary, calculated from total price over total games
   *         description: player's salary, calculated from total price over total games
   *         in: query
   *         name: salary
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - playerName: name of player to be purchased
   *         description: name of player to be purchased
   *         in: query
   *         name: playerName
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - playerUid: uid of player to be purchased
   *         description: uid of player to be purchased
   *         in: query
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - purchasePrice: purchasePrice of contract
   *         description: purchasePrice of contract
   *         in: query
   *         name: purchasePrice
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - status: status of contract
   *         description: status of contract
   *         in: query
   *         name: status
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - teamName: name of purchasing team
   *         description: name of purchasing team
   *         in: query
   *         name: teamName
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - teamUid: Uid of purchasing team
   *         description: uid of purchasing team
   *         in: query
   *         name: teamUid
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *     responses:
   *       201:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Contract"
   */
  routes.post('/contracts', authCheck, (req, res) => {
    contractController.create(req, res)
  })

    /**
   * @swagger
   * /api/contracts/{id}:
   *   x-swagger-router-controller: ../controllers/contractController
   *   put:
   *     tags:
   *       - Contract
   *     description: Updates a Contract
   *     operationId: update
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: id
   *         description: Contract's id
   *         in: path
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - name: status
   *         description: A string with the status of the contract
   *         in: query
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *       - name: access_token
   *         description: Access token for user
   *         in: query
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Contract'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Contract"
   */
  routes.put('/contracts/:id', authCheck, (req, res) => {
    contractController.update(req, res)
  })

  return routes
}
