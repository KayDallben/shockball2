//third party
import Joi from 'joi'

//internal
import PlayerSchema from '../models/Player.js'
import * as util from '../lib/util.js'

class PlayerController {

  constructor(db, logger) {
    this.players = db.collection('players')
    this.teams = db.collection('teams')
    this.events = db.collection('events')
    this.contracts = db.collection('contracts')
    this.logger = logger
  }

  async list(req, res) {
    const validation = Joi.validate(req.params, PlayerSchema.listParams)
    if (validation.error === null) {
      try {
        await this.players.get().then((snapshot) => {
          let players = []
          snapshot.forEach((doc) => {
            players.push(doc.data())
          })
          if (players.length > -1) {
            res.status(200).send(players)
          } else {
            throw {
              name: 'NoPlayersExist',
              message: 'There were no players found in the database for this query!'
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

  async update(req, res) {
    const {id} = req.params
    const validation = Joi.validate(req.query, PlayerSchema.updateParams)
    if (validation.error === null) {
      try {
        const updateSet = {
          regimen: JSON.parse(req.query.regimen)
        }
        await this.players.doc(id).update(updateSet).then(async (doc) => {
          if (doc._writeTime) {
            await this.players.doc(id).get().then((doc2) => {
              res.status(200).send(doc2.data())
            })
          } else {
            const errorMessage = 'Failed to write update to player for training regimen.'
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

  async listOne(req, res) {
    const validation = Joi.validate(req.params, PlayerSchema.listOneParams)
    if (validation.error === null) {
      try {
        await this.players.doc(req.params.id).get().then(async(doc) => {
          let playerData = doc.data()
          playerData.teamData = {}
          playerData.contractData = {}
          playerData.records = []
          if (playerData.teamUid && playerData.teamUid.length > 0) {
            await this.teams.doc(playerData.teamUid).get().then((doc2) => {
              playerData.teamData = doc2.data()
            })
          }
          if (playerData.contractUid && playerData.contractUid.length > 0) {
            await this.contracts.doc(playerData.contractUid).get().then((doc3) => {
              playerData.contractData = doc3.data()
            })
          }
          await this.events.where('actorUid', '==', playerData.createdAsUid).get().then((snapshot) => {
            let events = []
            snapshot.forEach((doc4) => {
              events.push(doc4.data())
            })
            if (events.length > 0) {
              playerData.records = util.generateSummaryRecords(events)
            } else {
              playerData.records = [{
                season: '1',
                matches: 0,
                goals: 0,
                shots: 0,
                passes: 0,
                blocksPass: 0,
                blocksShot: 0,
                tackles: 0,
                runsBall: 0,
                goalAverage: 0
              }]
            }
          })
          res.status(200).send(playerData)
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

export default PlayerController