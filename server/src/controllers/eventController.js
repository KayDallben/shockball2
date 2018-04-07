/* eslint no-use-before-define: 0 */  // --> OFF

//third party
import Joi from 'joi'

//internal
import EventSchema from '../models/Event.js'

class EventController {

  constructor(db, logger) {
    this.events = db.collection('events')
    this.logger = logger
  }

  async list(req, res) {
    const searchValidation = Joi.validate(req.query, EventSchema.listParams)
    if (searchValidation.error === null) {
      try {
        await this.events.where(req.query.queryProp, '==', req.query.queryVal).get().then((snapshot) => {
          let events = []
          snapshot.forEach((doc) => {
            events.push(doc.data())
          })
          if (events.length > -1) {
            res.status(200).send(events)
          } else {
            throw {
              name: 'NoEventsExist',
              message: 'There were no events found in the database for this query!'
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

export default EventController