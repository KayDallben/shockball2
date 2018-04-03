//third party
import Joi from 'joi'

//internal
import TeamSchema from '../models/Team.js'

class TeamController {

  constructor(db, logger) {
    this.teams = db.collection('teams')
    this.logger = logger
  }

  async list(req, res) {
    const validation = Joi.validate(req.params, TeamSchema.listParams)
    if (validation.error === null) {
      try {
        await this.teams.get().then((snapshot) => {
          let teams = []
          snapshot.forEach((doc) => {
            teams.push(doc.data())
          })
          if (teams.length > -1) {
            res.status(200).send(teams)
          } else {
            throw {
              name: 'NoTeamsExist',
              message: 'There were no teams found in the database for this query!'
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
    const validation = Joi.validate(req.params, TeamSchema.listOneParams)
    if (validation.error === null) {
      try {
        await this.teams.doc(req.params.id).get().then((doc) => {
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

export default TeamController
