//Is es6+ code, can delete this comment
import Joi from 'joi'
import PlayersSchema from '../models/Players.js'

class PlayersController {

  constructor(db, logger) {
    this.items = db.collection('players')
    this.logger = logger
  }

  listOne(req, res) {
    // we use Joi validation library to validate the req.params is in the model we defined in /models/ExampleItems.js
    const validation = Joi.validate(req.params, PlayerSchema.listOneParams)
    if (validation.error === null) {
      const {id} = req.params
      try {
        const exampleItem = { id: id, name: 'someString' }
        res.status(200).send(exampleItem)
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

export default PlayersController
