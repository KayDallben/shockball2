//third party
import Joi from 'joi'

//internal
import FixtureSchema from '../models/Fixture.js'

class FixtureController {

  constructor(db, logger) {
    this.fixtures = db.collection('fixtures')
    this.logger = logger
  }

  async list(req, res) {
    const validation = Joi.validate(req.params, FixtureSchema.listParams)
    if (validation.error === null) {
      try {
        await this.fixtures.where('season', '==', '1').get().then((snapshot) => {
          let fixtures = []
          snapshot.forEach((doc) => {
            fixtures.push(doc.data())
          })
          if (fixtures.length > -1) {
            res.status(200).send(fixtures)
          } else {
            throw {
              name: 'NoFixturesExist',
              message: 'There were no fixtures found in the database for this query!'
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

}

export default FixtureController
