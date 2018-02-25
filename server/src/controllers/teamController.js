//third party
import Joi from 'joi'

//internal
import TeamSchema from '../models/Team.js'

class TeamController {

  constructor(db, logger) {
    this.teams = db.collection('teams')
    this.logger = logger
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
