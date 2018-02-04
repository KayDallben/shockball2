//internal
import logger from './logger'
import * as swcApi from './swcApi'

export default async function isAuthenticated(req, res, next) {
  console.log('got in the authCheck') //eslint-disable-line no-console
  const swcToken = req.query.access_token
  try {
    console.log('before the validCombinePlayer async call') //eslint-disable-line no-console
    const validCombinePlayer = await swcApi.getPlayerUid(swcToken)
    console.log('validCombinePlayerData is &&&&&&&&&&&&&&&&&&&&&&&&&') //eslint-disable-line no-console
    console.log(validCombinePlayer.data) //eslint-disable-line no-console
    req.uid = validCombinePlayer.data.character.uid
    req.swcToken = swcToken
  } catch (error) {
    console.log('error in the auth check') //eslint-disable-line no-console
    console.log(error) //eslint-disable-line no-console
    logger.error(error)
  }
  next()
}