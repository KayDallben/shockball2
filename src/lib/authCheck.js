//third party
import axios from 'axios'
import serializeError from 'serialize-error'

//internal
import logger from './logger'
import * as swcApi from './swcApi'

export default async function isAuthenticated(req, res, next) {
  const swcToken = req.header('Authorization')
  try {
    const validCombinePlayer = await swcApi.getPlayerUid(swcToken)
    req.uid = validCombinePlayer.data.character.uid
    req.swcToken = swcToken
  } catch (error) {
    logger.error(error)
  }
  next()
}