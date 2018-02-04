//third party
import Joi from 'joi'

//internal
import * as swcApi from '../lib/swcApi'
import LoginSchema from '../models/Login.js'

class LoginController {

  constructor(logger) {
    this.logger = logger
  }

  async listOne(req, res) {
    const validation = Joi.validate(req.query, LoginSchema.listOneParams)
    if (validation.error === null) {
      try {
        const tokenInfo = await swcApi.getAccessToken(req.query.authorization_code)
        res.status(200).send(tokenInfo.data)
      } catch(error) {
        this.logger.error(error)
        res.status(400).send('Error creating new player in database')
      }
    } else {
      this.logger.error('Joi validation error: ' + validation.error)
      res.status(400).send(validation.error)
    }
  }

}

export default LoginController