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
    console.log('got in the listOne controller') //eslint-disable-line no-console
    const validation = Joi.validate(req.query, ProfileSchema.listOneParams)
    if (validation.error === null) {
      console.log('req.uid is actually%%%%%%%%%%%%%%%%%%%%%%') //eslint-disable-line no-console
      console.log(req.uid) //eslint-disable-line no-console
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
    console.log('uid in checkIfPlayerExists shows as __________________________') //eslint-disable-line no-console
    console.log(uid) //eslint-disable-line no-console
    return this.players.doc(uid).get().then(doc => {
      console.log('firebase player check response is (((((((((((((((((((((') //eslint-disable-line no-console
      console.log(doc) //eslint-disable-line no-console
      if (doc.exists) {
        console.log('doc exists so trying to return data @@@@@@@@@@@@@@@@@@@@@@@@@') //eslint-disable-line no-console
        console.log(doc.data()) //eslint-disable-line no-console
        return doc.data()
      } else {
        console.log('doc does not exist, returning false ^^^^^^^^^^^^^^^^^^^^^^^^^^') //eslint-disable-line no-console
        return false
      }
    }).catch(error => {
      console.log('there was an error calling firebase, $$$$$$$$$$$$$$$$$$$$$$') //eslint-disable-line no-console
      console.log(error) //eslint-disable-line no-console
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
