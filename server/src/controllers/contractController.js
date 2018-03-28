//third party
import Joi from 'joi'
import * as admin from 'firebase-admin'

//internal
import ContractSchema from '../models/Contract.js'
const FieldValue = admin.firestore.FieldValue

class ContractController {

  constructor(db, logger) {
    this.contracts = db.collection('contracts')
    this.logger = logger
  }

  async list(req, res) {
    const validation = Joi.validate(req.query, ContractSchema.listParams)
    if (validation.error === null) {
      try {
        await this.contracts.where(req.query.queryProp, '==', req.query.queryVal).get().then((snapshot) => {
          let contracts = []
          snapshot.forEach((doc) => {
            contracts.push(doc.data())
          })
          res.status(200).send(contracts)
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
    const validation = Joi.validate(req.params, ContractSchema.listOneParams)
    if (validation.error === null) {
      try {
        await this.contracts.doc(req.params.id).get().then((doc) => {
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

  async create(req, res) {
    const validation = Joi.validate(req.body, ContractSchema.create)
    if (validation.error === null) {
      try {
        const updateSet = req.body
        const newContract = await this.contracts.add(updateSet)
        await newContract.update({
          contractUid: newContract.id,
          created: FieldValue.serverTimestamp(),
          lastModified: FieldValue.serverTimestamp(),
        })
        await this.contracts.doc(newContract.id).get().then((doc) => {
          res.status(201).send(doc.data())
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

export default ContractController