//third party libraries
import { Router } from 'express'
const routes = Router()

// Internal code/packages
import authCheck from '../lib/authCheck'
import ExampleItemsController from '../controllers/exampleItemsController'
import AuthController from '../controllers/authController'
import { reverseString } from '../lib/util'

export default (db, logger) => {
  const exampleItemsController = new ExampleItemsController(reverseString, db, logger)
  const authController = new AuthController(db, logger)

  /**
   * @swagger
   * definitions:
   *   ExampleItem:
   *     properties:
   *       name:
   *         type: "string"
   *   Auth:
   *     properties:
   *       uid:
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
    // TODO: Alex, write a comment about why we have to pass req/res like this.
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
   * /api/auth:
   *   x-swagger-router-controller: ../controllers/authController
   *   get:
   *     tags:
   *       - Auth
   *     description: Get auth token via uid
   *     operationId: listOne
   *     produces:
   *       - application/json
   *     parameters:
   *       - uid: unique id
   *         description: unique id of user
   *         in: query
   *         name: uid
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Auth'
   *     responses:
   *       200:
   *         description: Success
   *         schema:
   *           $ref: "#/definitions/Auth"
   */
  routes.get('/auth', (req, res) => {
    authController.listOne(req, res)
  })

  return routes
}
