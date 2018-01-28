//Is es6+ code, can delete this comment
import Joi from 'joi'
import ExampleItemSchema from '../models/ExampleItems.js'

class ExampleItemsController {
  // example of using a Constructor for dependecy injection - not required, can remove constructor altogether if no dependencies needed
  // also demonstrating using the constructor here as our dependency injection
  constructor(reverseStringDependency, db, logger) {
    this.reverseString = reverseStringDependency
    this.items = db.ref('items')
    this.logger = logger
  }

  list(req, res) {
    try {
      this.items.on('value', function(snapshot) {
        this.logger.info(snapshot.val())
      })
      const stringInReverse = this.reverseString('someTestName')
      const lines = [{ name: stringInReverse}, { name: 'anotherTestName' } ]
      res.status(200).send(lines)
    } catch (error) {
      this.logger.error(error)
      res.status(400).send(error)
    }
  }

  listOne(req, res) {
    // we use Joi validation library to validate the req.params is in the model we defined in /models/ExampleItems.js
    const validation = Joi.validate(req.params, ExampleItemSchema.listOneParams)
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

export default ExampleItemsController
