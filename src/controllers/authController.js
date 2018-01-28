//third party
import Joi from 'joi'
import * as admin from 'firebase-admin'

//internal
import AuthSchema from '../models/Auth.js'


class AuthController {
  // example of using a Constructor for dependecy injection - not required, can remove constructor altogether if no dependencies needed
  // also demonstrating using the constructor here as our dependency injection
  constructor(db, logger) {
    this.db = db
    this.logger = logger
  }

  listOne(req, res) {
    const validation = Joi.validate(req.query, AuthSchema.listOneParams)
    if (validation.error === null) {
      const {uid} = req.query
      try {
        admin.auth().createCustomToken(uid).then(function(customToken) {
            res.status(200).send(customToken)
        })
        .catch(function(error) {
            this.logger.error("Error creating custom token:", error);
        });
      } catch (error) {
        this.logger.error(error)
        res.status(400).send(error)
      }
    } else {
      this.logger.error('Joi validation error: ' + validation.error)
      res.status(400).send(validation.error)
    }
  }

}

export default AuthController