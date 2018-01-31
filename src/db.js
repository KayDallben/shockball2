import * as admin from 'firebase-admin'
import serviceAccount from '../firebase-security.json'

export default callback => {

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://swc-shockball3.firebaseio.com/'
  })

  let db = admin.firestore()

  callback(db)
}