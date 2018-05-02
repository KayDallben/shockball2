const admin = require('firebase-admin')

const FieldValue = admin.firestore.FieldValue;
const args = process.argv.slice(2)
let serviceAccount

if (!process.env.FIREBASE_DATABASE_URL) {
  serviceAccount = require('../firebase-security.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://swc-shockball3.firebaseio.com/'
  })
} else {
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

async function init() {
  try {
    const deleteId = args[0] ? args[0] : null
    if (deleteId) {
      console.log('deleting match')
      await deleteMatchEvents(deleteId)
      await resetFixtureResults(deleteId)
    }
  } catch (error) {
    console.log(error)
  }
}

async function resetFixtureResults(fixtureId) {
    const fixture = db.collection('fixtures').doc(fixtureId)
    return await fixture.update({
        awayTeamScore: FieldValue.delete(),
        homeTeamScore: FieldValue.delete(),
        status: 'pending'
    })
}

async function deleteMatchEvents(fixtureId) {
  var records_query = db.collection('events').where('fixtureId', '==', fixtureId);
  return records_query.get().then(async function (querySnapshot) {
    querySnapshot.forEach(async function(doc) {
      await deleteEvent(doc.id)
    });
  })
}

async function deleteEvent(eventId) {
  return await deleteFromCollectionById('events', eventId)
}

async function deleteFromCollectionById(collection, id) {
  return db.collection(collection).doc(id).delete()
}

init()