//third party
import Joi from 'joi'
import * as admin from 'firebase-admin'

//internal
import ContractSchema from '../models/Contract.js'
const FieldValue = admin.firestore.FieldValue

class ContractController {

  constructor(db, logger) {
    this.contracts = db.collection('contracts')
    this.accounts = db.collection('accounts')
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
        await this.accounts.doc(req.body.teamUid).get().then(async (doc) => {
          const teamAccount = doc.data()
          if (teamAccount.availableBudget - req.body.purchasePrice < 0) {
            res.status(400).send('Cannot spend more than availble team budget!')
            return
          } else {
            const newContract = await this.contracts.add(updateSet)
            await newContract.update({
              contractUid: newContract.id,
              created: FieldValue.serverTimestamp(),
              lastModified: FieldValue.serverTimestamp(),
            })
            await this.contracts.doc(newContract.id).get().then(async (doc2) => {
              const savedContract = doc2.data()
              await this.updateTeamAccount(savedContract, teamAccount)
              res.status(201).send(savedContract)
            })
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

  async update(req, res) {
    const { id } = req.params
    const validation = Joi.validate(req.query, ContractSchema.updateParams)
    if (validation.error === null) {
      try {
        const updateSet = {
          status: req.query.status
        }
        await this.contracts.doc(id).update(updateSet).then(async (doc) => {
          if (doc._writeTime) {
            await this.contracts.doc(id).get().then(doc2 => {
              res.status(200).send(doc2.data())
            })
          } else {
            const errorMessage = 'Failed to write update to contract.'
            this.logger.error(errorMessage)
            res.status(400).send(errorMessage)
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

  async updateTeamAccount(contract, teamAccount) {
    await this.accounts.doc(contract.teamUid).collection('transactions').add({
      activityType: `Player contract bid sent to ${contract.playerName}`,
      timestamp: FieldValue.serverTimestamp(),
      amount: contract.purchasePrice
    })
    await this.accounts.doc(contract.teamUid).update({
      availableBudget: teamAccount.availableBudget - contract.purchasePrice
    })
  }
}

export default ContractController