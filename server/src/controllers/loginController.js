//third party
import Joi from 'joi'

//internal
import * as swcApi from '../lib/swcApi'
import LoginSchema from '../models/Login.js'

class LoginController {

  constructor(db, logger) {
    this.tokens = db.collection('tokens')
    this.logger = logger
  }

  async listOne(req, res) {
    const validation = Joi.validate(req.query, LoginSchema.listOneParams)
    if (validation.error === null) {
      try {
        const tokenInfo = await swcApi.getAccessToken(req.query.authorization_code)
        const expiresAtMinutes = ((tokenInfo.data.expires_in - 120) / 60 )
        const newToken = await this.tokens.add({
          access_token: tokenInfo.data.access_token,
          refresh_token: tokenInfo.data.refresh_token,
          expires_at: this.dateWithAddedMinutes(expiresAtMinutes),
          created_at: new Date()
        })
        await this.tokens.doc(newToken.id).update({
          uid: newToken.id
        })
        const safeTokenInfo = {
          access_token: tokenInfo.data.access_token,
          expires_at: this.dateWithAddedMinutes(expiresAtMinutes)
        }
        res.status(200).send(safeTokenInfo)
      } catch(error) {
        this.logger.error(error)
        res.status(400).send('Error creating new player in database')
      }
    } else {
      this.logger.error('Joi validation error: ' + validation.error)
      res.status(400).send(validation.error)
    }
  }

  dateWithAddedMinutes(minutes) {
    return new Date(new Date().getTime() + (minutes * 60000))
  }

}

export default LoginController