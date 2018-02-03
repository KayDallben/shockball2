//third party libraries
import { Router } from 'express'
const routes = Router()

// Internal code/packages
import authCheck from '../lib/authCheck'
import ExampleItemsController from '../controllers/exampleItemsController'
import PlayersController from '../controllers/playersController'
import ProfileController from '../controllers/profileController'
import LoginController from '../controllers/loginController'
import { reverseString } from '../lib/util'

export default (db, logger) => {
  const exampleItemsController = new ExampleItemsController(reverseString, db, logger)
  const playersController = new PlayersController(db, logger)
  const profileController = new ProfileController(db, logger)
  const loginController = new LoginController(logger)

  /**
   * @swagger
   * definitions:
   *   ExampleItem:
   *     properties:
   *       name:
   *         type: "string"
   *   Player:
   *     properties:
   *       handle:
   *         type: "string"
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
   * /api/exampleItems:
   *   x-swagger-router-controller: ../controllers/exampleItemsController
   *   get:
   *     tags:
   *       - ExampleItems
   *     description: Get a list of example items
   *     operationId: list
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/ExampleItem"
   *       400:
   *         description: Bad request
   */
  routes.get('/exampleItems', authCheck, (req, res) => {
    exampleItemsController.list(req, res)
  })


  /**
   * @swagger
   * /api/exampleItems/{id}:
   *   x-swagger-router-controller: ../controllers/exampleItemsController
   *   get:
   *     tags:
   *       - ExampleItems
   *     description: Get a single example item by id
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: exampleItem id
   *         description: ID of the exampleItem
   *         in: path
   *         name: id
   *         required: true
   *         schema:
   *           $ref: '#/definitions/ExampleItem'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/ExampleItem"
   */
  routes.get('/exampleItems/:id', authCheck, (req, res) => {
    exampleItemsController.listOne(req, res)
  })

  /**
   * @swagger
   * /api/players/{id}:
   *   x-swagger-router-controller: ../controllers/playersController
   *   get:
   *     tags:
   *       - Players
   *     description: Get a single player by id
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - id: player id
   *         description: ID of the player
   *         in: path
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
    playersController.listOne(req, res)
  })

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

  return routes
}
