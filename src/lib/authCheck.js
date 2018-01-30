//third party
import * as admin from 'firebase-admin'
import axios from 'axios'

//internal
import logger from './logger'


export default function isAuthenticated(req, res, next) {
  const swcToken = req.header('Authorization')
  if (swcToken) {
    //validate with swc token endpoint that this access token is legitimate
    axios.get('https://www.swcombine.com/ws/oauth2/tokeninfo', {
      params: {
        access_token: swcToken
      }
    }).then(function(response) {
      console.log('success!')
      console.log(response)
      next()
    }).catch(function(error) {
      console.log(error)
      logger.error(error)
      res.status(401).send(error)
    })
  } else {
    logger.error('Authorization header not found')
    res.status(401).send()
  }
}
