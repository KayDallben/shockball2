//third party
import Joi from 'joi'

//internal
import FixtureSchema from '../models/Fixture.js'

class FixtureController {

  constructor(db, logger) {
    this.fixtures = db.collection('fixtures')
    this.events = db.collection('events')
    this.logger = logger
  }

  async list(req, res) {
    if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
      const validation = Joi.validate(req.params, FixtureSchema.listParams)
      if (validation.error === null) {
        try {
          await this.fixtures.get().then((snapshot) => {
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
    } else {
      //we are searching for fixtures by criteria
      const searchValidation = Joi.validate(req.query, FixtureSchema.listSearchParams)
      if (searchValidation.error === null) {
        try {
          await this.fixtures.where(req.query.queryProp, '==', req.query.queryVal).get().then((snapshot) => {
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
        this.logger.error('Joi validation error: ' + searchValidation.error)
        res.status(400).send(searchValidation.error)
      }
    }
  }

  async listOne(req, res) {
    const validation = Joi.validate(req.params, FixtureSchema.listOneParams)
    if (validation.error === null) {
      try {
        let fixtureData = {}
        await this.fixtures.doc(req.params.id).get().then((doc) => {
          fixtureData.fixtureInfo = doc.data()
        })
        await this.events.where('fixtureId', '==', req.params.id).orderBy('recordRealTime').get().then((snapshot) => {
          let events = []
          snapshot.forEach((doc) => {
            events.push(doc.data())
          })
          if (events.length > -1) {
            fixtureData.events = events
          } else {
            throw {
              name: 'NoEventsExist',
              message: 'There were no events found in the database for this fixture!'
            }
          }
        })
        res.status(200).send(fixtureData)
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
