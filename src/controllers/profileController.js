//third party
import Joi from 'joi'
import axios from 'axios'
import * as admin from 'firebase-admin'
const FieldValue = admin.firestore.FieldValue

//internal
import ProfileSchema from '../models/Profile.js'

class ProfileController {

  constructor(db, logger) {
    this.players = db.collection('players')
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
      const swcCharacter = await this.getCharacterInfo(uid, accessToken)
      await this.players.doc(uid).set({
        name: swcCharacter.character.name,
        image: swcCharacter.character.image,
        gender: swcCharacter.character.gender,
        race: swcCharacter.character.race.value,
        created: FieldValue.serverTimestamp()
      })
      return await this.players.doc(uid).get().then(doc => {
        return doc.data()
      })
    } catch (error) {
      this.logger.error(error)
      return false
    }
  }

  checkIfPlayerExists(uid) {
    return this.players.doc(uid).get().then(doc => {
      if (doc.exists) {
        return doc.data()
      } else {
        return false
      }
    }).catch(error => {
      this.logger.error(error)
    })
  }

  getCharacterInfo(uid, accessToken) {
    console.log('uid is========================== ') //eslint-disable-line no-console
    console.log(uid) //eslint-disable-line no-console
    return axios({
      url: `http://www.swcombine.com/ws/v1.0/character/${uid}`,
      method: 'GET',
      params: {
        'access_token': accessToken
      },
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      console.log('response from swc /character call is==================') //eslint-disable-line no-console
      console.log(response) //eslint-disable-line no-console
      return response.data
    }).catch(error => {
      this.logger.error('Error calling character info at SWC')
      this.logger.error(error)
      return error
    })
  }

}

export default ProfileController
