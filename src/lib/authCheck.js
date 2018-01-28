import * as admin from 'firebase-admin'
import logger from './logger'

export default function isAuthenticated(req, res, next) {
  const idToken = req.header('Authorization')
  if (idToken) {
    admin.auth().verifyIdToken(idToken).then(decodedToken => {
      res.locals.user = decodedToken
      next()
    }).catch(error => {
      // Handle error
      logger.error(error)
      res.send(401).send(error)
    })
  } else {
    logger.error('Authorization header not found')
    res.status(401).send()
  }
}
