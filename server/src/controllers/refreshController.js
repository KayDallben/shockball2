//third party
import Joi from 'joi'

//internal
import * as swcApi from '../lib/swcApi'
import RefreshSchema from '../models/Refresh.js'

class RefreshController {

  constructor(db, logger) {
    this.tokens = db.collection('tokens')
    this.logger = logger
  }

  async listOne(req, res) {
    const validation = Joi.validate(req.query, RefreshSchema.listOneParams)
    if (validation.error === null) {
      // get access token from db and corresponding refresh token
      await this.tokens.where('access_token', '==', req.query.access_token).get().then(async (snapshot) => {
        let userTokenObjects = []
        snapshot.forEach((doc) => {
          userTokenObjects.push(doc.data())
        })
        const userTokenObject = userTokenObjects[0]
        try {
          const newTokenInfo = await swcApi.refreshAccessToken(userTokenObject.refresh_token)
          const expiresAtMinutes = ((newTokenInfo.data.expires_in - 120) / 60 )
          const newToken = await this.tokens.add({
            access_token: newTokenInfo.data.access_token,
            refresh_token: newTokenInfo.data.refresh_token,
            expires_at: this.dateWithAddedMinutes(expiresAtMinutes),
            created_at: new Date()
          })
          await this.tokens.doc(newToken.id).update({
            uid: newToken.id
          })
          const safeTokenInfo = {
            access_token: newTokenInfo.data.access_token,
            expires_at: this.dateWithAddedMinutes(expiresAtMinutes)
          }
          res.status(200).send(safeTokenInfo)
        } catch(error) {
          this.logger.error(error)
          res.status(200).send(userTokenObject)
        }
      })
    } else {
      this.logger.error('Joi validation error: ' + validation.error)
      res.status(400).send(validation.error)
    }
  }

  dateWithAddedMinutes(minutes) {
    return new Date(new Date().getTime() + (minutes * 60000))
  }

}

export default RefreshController