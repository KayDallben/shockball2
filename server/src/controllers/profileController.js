//third party
import Joi from 'joi'
import axios from 'axios'
import * as admin from 'firebase-admin'
import Chance from 'chance'

//internal
import ProfileSchema from '../models/Profile.js'
import * as util from '../lib/util.js'

const FieldValue = admin.firestore.FieldValue
const chance = new Chance()

class ProfileController {

  constructor(db, logger) {
    this.players = db.collection('players')
    this.teams = db.collection('teams')
    this.contracts = db.collection('contracts')
    this.accounts = db.collection('accounts')
    this.events = db.collection('events')
    this.playerCaps = db.collection('playerCaps')
    this.logger = logger
  }

  async listOne(req, res) {
    const validation = Joi.validate(req.query, ProfileSchema.listOneParams)
    if (validation.error === null) {
      try {
        const player = await this.checkIfPlayerExists(req.uid)
        if (player) {
          res.status(200).send(player)
        } else {
          //we need to create a new player
          const newPlayer = await this.createNewPlayer(req.uid, req.swcToken)
          await this.decoratePlayer(newPlayer)
          if (newPlayer) {
            res.status(201).send(newPlayer)
          } else {
            res.status(400).send('Error creating new player in database')
          }
        }
      } catch (error) {
        this.logger.error(error)
        res.status(400).send(error)
      }
    } else {
      this.logger.error('Joi validation error: ' + validation.error)
      res.status(400).send(validation.error)
    }
  }

  async createNewPlayer(uid, accessToken) {
    try {
      const baseStats = this.rollBaseStats()
      const playerValue = util.calculatePlayerValue(baseStats)
      const swcCharacter = await this.getCharacterInfo(uid, accessToken)
      const playerEntity = {
        name: swcCharacter.character.name,
        image: swcCharacter.character.image,
        gender: swcCharacter.character.gender,
        race: swcCharacter.character.race.value,
        created: FieldValue.serverTimestamp(),
        swcPlayerUid: uid,
        passing: baseStats.passing,
        throwing: baseStats.throwing,
        blocking: baseStats.blocking,
        toughness: baseStats.toughness,
        morale: baseStats.morale,
        vision: baseStats.vision,
        leadership: baseStats.leadership,
        aggression: baseStats.aggression,
        endurance: baseStats.endurance,
        energy: baseStats.energy,
        marketValue: playerValue.marketValue,
        rating: playerValue.playerRating
      }
      const newPlayer = await this.players.add(playerEntity)
      await this.players.doc(newPlayer.id).update({
        shockballPlayerUid: newPlayer.id
      })
      await this.createPlayerStatCaps(newPlayer.id)
      await this.createPlayerAccount(newPlayer.id, playerEntity)
      return await this.players.doc(newPlayer.id).get().then(doc => {
        return doc.data()
      })
    } catch (error) {
      this.logger.error(error)
      return false
    }
  }

  rollBaseStats() {
    const baseStats = {
      passing: chance.integer({min:40, max:60}),
      throwing: chance.integer({min:40, max:60}),
      blocking: chance.integer({min:40, max:60}),
      toughness: chance.integer({min:40, max:60}),
      endurance: chance.integer({min:40, max:60}),
      vision: chance.integer({min:40, max:60}),
      morale: chance.integer({min:70, max:100}),
      leadership: chance.integer({min:10, max:80}),
      aggression: 0,
      energy: chance.integer({min:70, max:100})
    }
    return baseStats
  }

  async createPlayerAccount(playerId, player) {
    await this.accounts.doc(playerId).set({
      shockballPlayerUid: playerId,
      name: player.name,
      created: FieldValue.serverTimestamp(),
      lastModified: FieldValue.serverTimestamp(),
      totalBalance: 0
    })
    await this.accounts.doc(playerId).collection('transactions').add({
      activityType: 'Player account created for ' + player.name,
      timestamp: FieldValue.serverTimestamp(),
      amount: 0
    })
  }

  async createPlayerStatCaps(uid) {
    const playerWithStatCaps = {
      shockballPlayerUid: uid,
      created: FieldValue.serverTimestamp(),
      passing: chance.integer({min:75, max:100}),
      throwing: chance.integer({min:75, max:100}),
      blocking: chance.integer({min:75, max:100}),
      toughness: chance.integer({min:75, max:100}),
      endurance: chance.integer({min:75, max:100}),
      vision: chance.integer({min:75, max:100})
    }
    return await this.playerCaps.doc(uid).set(playerWithStatCaps)
  }

  async decoratePlayer(player) {
    let playerData = player
    playerData.teamData = {}
    playerData.contractData = {}
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
    try {
      if (!playerData.shockballPlayerUid) {
        playerData.shockballPlayerUid = '1'
      }
      await this.events.where('actorUid', '==', playerData.shockballPlayerUid).get().then((snapshot) => {
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
    } catch (error) {
      this.logger.error(error)
    }
    return playerData
  }

  checkIfPlayerExists(swcPlayerUid) {
    // important: here we are taking the swcUser uid to find the player - so this is a query to players collection
    return this.players.where('swcPlayerUid', '==', swcPlayerUid).get().then(async (snapshot) => {
      let players = []
      snapshot.forEach((doc) => {
        players.push(doc.data())
      })
      if (players.length > 0) {
        const player = players[0] // Should only ever be a single user, but this takes the first if there happens to be more than one?
        try {
          const decoratedPlayer = await this.decoratePlayer(player)
          return decoratedPlayer
        } catch(error) {
          this.logger.error(error)
          return false
        }
      } else {
        this.logger.error('checkIfPlayerExists did not find a matching player')
        return false
      }
    })
  }

  getCharacterInfo(uid, accessToken) {
    return axios({
      url: `http://www.swcombine.com/ws/v1.0/character/${uid}/`,
      method: 'GET',
      params: {
        'access_token': accessToken
      },
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      return response.data
    }).catch(error => {
      this.logger.error('Error calling character info at SWC')
      this.logger.error(error)
      return error
    })
  }

}

export default ProfileController
