import * as admin from 'firebase-admin'
import firebase from 'firebase'
import logger from './logger'

firebase.initializeApp({
  apiKey: 'AIzaSyAe_-Xten-mSxNIdrThMhEWgJxHVgPnke0',
  authDomain: 'swc-shockball3.firebaseapp.com',
  databaseURL: 'https://swc-shockball3.firebaseio.com',
  projectId: 'swc-shockball3',
  storageBucket: 'swc-shockball3.appspot.com',
  messagingSenderId: '577301617429'
})

export default function isAuthenticated(req, res, next) {
  const customToken = req.header('Authorization')
  if (customToken) {
    firebase.auth().signInWithCustomToken(customToken).then(user => {
      user.getIdToken().then(idToken => {
        admin.auth().verifyIdToken(idToken).then(decodedToken => {
          res.locals.user = decodedToken
          next()
        }).catch(error => {
          // Handle error
          logger.error(error)
          res.send(401).send(error)
        })
      })
    }).catch(function(error) {
      // Handle Errors here.
      logger.error(error.message)
      // ...
    })
  } else {
    logger.error('Authorization header not found')
    res.status(401).send()
  }
}
