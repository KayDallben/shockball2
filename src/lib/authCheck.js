//internal
import logger from './logger'
import * as swcApi from './swcApi'

export default async function isAuthenticated(req, res, next) {
  const swcToken = req.query.access_token
  try {
    const validCombinePlayer = await swcApi.getPlayerUid(swcToken)
    console.log('validCombinePlayerData is &&&&&&&&&&&&&&&&&&&&&&&&&') //eslint-disable-line no-console
    console.log(validCombinePlayer.data) //eslint-disable-line no-console
    req.uid = validCombinePlayer.data.character.uid
    req.swcToken = swcToken
  } catch (error) {
    logger.error(error)
  }
  next()
}