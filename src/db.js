import * as admin from 'firebase-admin'
let serviceAccount
if (!process.env.FIREBASE_DATABASE_URL) {
  serviceAccount = require('../firebase-security.json')
}


export default (app, callback) => {

  if (app.get('env') === 'development') {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://swc-shockball3.firebaseio.com/'
    })
  } else if (app.get('env') === 'production') {
    admin.initializeApp({
      credential: admin.credential.cert({
        'projectId': process.env.FIREBASE_PROJECT_ID,
        'clientEmail': process.env.FIREBASE_CLIENT_EMAIL,
        'privateKey': process.env.FIREBASE_PRIVATE_KEY,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    })
  }

  let db = admin.firestore()

  callback(db)
}