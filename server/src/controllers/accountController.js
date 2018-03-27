//third party
import Joi from 'joi'

//internal
import AccountSchema from '../models/Account.js'

class AccountController {

  constructor(db, logger) {
    this.accounts = db.collection('accounts')
    this.logger = logger
  }

  async listOne(req, res) {
    const validation = Joi.validate(req.params, AccountSchema.listOneParams)
    if (validation.error === null) {
      try {
        await this.accounts.doc(req.params.id).get().then(async (doc) => {
          let userAccount = doc.data()
          userAccount.transactions = []
          await this.accounts.doc(req.params.id).getCollections().then(collections => {
            collections.forEach(collection => {
              collection.get().then(snapshot => {
                snapshot.forEach((doc2) => {
                  userAccount.transactions.push(doc2.data())
                })
                res.status(200).send(userAccount)
              })
            })
          })
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

  async list(req, res) {
    const validation = Joi.validate(req.params, AccountSchema.listParams)
    if (validation.error === null) {
      try {
        await this.accounts.get().then((snapshot) => {
          let accounts = []
          snapshot.forEach((doc) => {
            accounts.push(doc.data())
          })
          if (accounts.length > -1) {
            res.status(200).send(accounts)
          } else {
            throw {
              name: 'NoAccountsExist',
              message: 'There were no accounts found in the database for this query!'
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

export default AccountController