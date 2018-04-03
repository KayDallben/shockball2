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
    this.players = db.collection('players')
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

  async remove(req, res) {
    const validation = Joi.validate(req.query, ContractSchema.removeParams)
    if (validation.error === null) {
      try {
        const contract = await this.contracts.doc(req.params.id).get().then(doc => {
          return doc.data()
        })
        await this.contracts.doc(contract.contractUid).delete()
        await this.updatePlayerTransactions(contract.playerUid, contract)
        await this.returnTeamAvailableBudget(contract.teamUid, contract.purchasePrice)
        await this.updateTeamAccountTransactions(contract.teamUid, contract)
        res.status(200).send('Contract deleted successfully')
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
            res.status(400).send('Cannot spend more than available team budget!')
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
        let updateSet = {
          status: req.query.status,
          enactedOn: FieldValue.serverTimestamp()
        }
        if (req.query.isFeePaid) {
          updateSet = Object.assign(updateSet, { isFeePaid: true })
        }
        await this.contracts.doc(id).update(updateSet).then(async (doc) => {
          if (doc._writeTime) {
            await this.contracts.doc(id).get().then(async (doc2) => {
              const newContract = doc2.data()
              await this.notifyPartiesAboutContractAccept(newContract)
              res.status(200).send(newContract)
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

  async returnTeamAvailableBudget(teamUid, amount) {
    //update team account budget - puts back contract purchase price into team's availableBudget
    try {
      await this.accounts.doc(teamUid).get().then(async (doc) => {
        const teamAccount = doc.data()
        await this.accounts.doc(teamUid).update({
          availableBudget: teamAccount.availableBudget + amount
        })
      })
    } catch(error) {
      this.logger.error(error)
    }
  }

  async notifyPartiesAboutContractAccept(newContract) {
    // if accepted, then write to team and player transactions
    if (newContract.status === 'accepted') {
      await this.accounts.doc(newContract.playerUid).collection('transactions').add({
        activityType: `${newContract.playerName} accepted a contract bid from ${newContract.teamName}`,
        amount: newContract.purchasePrice,
        timestamp: FieldValue.serverTimestamp()
      })
      await this.accounts.doc(newContract.teamUid).collection('transactions').add({
        activityType: `${newContract.playerName} accepted a contract bid from ${newContract.teamName}`,
        amount: newContract.purchasePrice,
        timestamp: FieldValue.serverTimestamp()
      })
    } else if (newContract.status === 'rejected') {
      await this.accounts.doc(newContract.playerUid).collection('transactions').add({
        activityType: `${newContract.playerName} rejected a contract bid from ${newContract.teamName}`,
        amount: newContract.purchasePrice,
        timestamp: FieldValue.serverTimestamp()
      })
      await this.accounts.doc(newContract.teamUid).collection('transactions').add({
        activityType: `${newContract.playerName} rejected a contract bid from ${newContract.teamName}`,
        amount: newContract.purchasePrice,
        timestamp: FieldValue.serverTimestamp()
      })
    } else if (newContract.status === 'active') {
      await this.accounts.doc(newContract.playerUid).collection('transactions').add({
        activityType: `${newContract.playerName}'s contract is active for ${newContract.teamName}!`,
        amount: newContract.purchasePrice,
        timestamp: FieldValue.serverTimestamp()
      })
      await this.accounts.doc(newContract.teamUid).collection('transactions').add({
        activityType: `${newContract.playerName}'s contract is active for ${newContract.teamName}!`,
        amount: newContract.purchasePrice,
        timestamp: FieldValue.serverTimestamp()
      })
      await this.addPlayerSigningBonus(newContract)
      await this.updatePlayerEntityWithContract(newContract)
      await this.updateTeamPotentialBudget(newContract)
    }
  }

  async addPlayerSigningBonus(newContract) {
    await this.accounts.doc(newContract.playerUid).update({
      totalBalance: newContract.purchasePrice * .2
    })
  }

  async updateTeamPotentialBudget(newContract) {
    const teamAccount = await this.accounts.doc(newContract.teamUid).get().then((doc) => {
      return doc.data()
    })
    await this.accounts.doc(newContract.teamUid).update({
      potentialBudget: teamAccount.potentialBudget - newContract.purchasePrice
    })
  }

  async updatePlayerTransactions(playerUid, contract) {
    // update player transactions - event informing contract was deleted
    try {
      await this.accounts.doc(playerUid).collection('transactions').add({
        activityType: `Contract bid from ${contract.teamName} was deleted by admin`,
        amount: 0,
        timestamp: FieldValue.serverTimestamp()
      })
    } catch(error) {
      this.logger.error(error)
    }
  }

  async updatePlayerEntityWithContract(newContract) {
    await this.players.doc(newContract.playerUid).update({
      contractUid: newContract.contractUid,
      teamUid: newContract.teamUid
    })
  }

  async updateTeamAccountTransactions(teamUid, contract) {
    // update team account transactions - event informing contract was deleted AND transaction for availableBudget being put back
    try {
      await this.accounts.doc(teamUid).collection('transactions').add({
        activityType: `Contract bid to ${contract.playerName} was deleted by admin`,
        amount: 0,
        timestamp: FieldValue.serverTimestamp()
      })
      await this.accounts.doc(teamUid).collection('transactions').add({
        activityType: `Funds for ${contract.playerName} failed contract bid returned to Available budget`,
        amount: contract.purchasePrice,
        timestamp: FieldValue.serverTimestamp()
      })
    } catch(error) {
      this.logger.error(error)
    }
  }
}

export default ContractController