//third party
import Joi from 'joi'

//internal
import PlayerSchema from '../models/Player.js'

class PlayerController {

  constructor(db, logger) {
    this.players = db.collection('players')
    this.logger = logger
  }

  async list(req, res) {
    const validation = Joi.validate(req.params, PlayerSchema.listParams)
    if (validation.error === null) {
      try {
        await this.players.get().then((snapshot) => {
          let players = []
          snapshot.forEach((doc) => {
            players.push(doc.data())
          })
          if (players.length > -1) {
            res.status(200).send(players)
          } else {
            throw {
              name: 'NoPlayersExist',
              message: 'There were no players found in the database for this query!'
            }
          }
        })
      } catch (error) {
        this.logger.error(error)
        res.status(400).send(error)
      }
    } else {
      this.logger.error('Joi validation error: ' + validation.error)
      res.status(400).send(validation.error)
    }
  }

  async listOne(req, res) {
    const validation = Joi.validate(req.params, PlayerSchema.listOneParams)
    if (validation.error === null) {
      try {
        await this.players.doc(req.params.id).get().then((doc) => {
          res.status(200).send(doc.data())
        })
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

export default PlayerController
