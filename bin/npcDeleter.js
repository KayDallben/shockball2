const admin = require('firebase-admin')
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
    if (deleteId === 'all') {
      console.log('deleting all')
      await deleteAllNpcs()
    } else {
      console.log('deleting ' + deleteId)
      await deleteNpc(deleteId)
    }
  } catch (error) {
    console.log(error)
  }
}

async function deleteAllNpcs() {
  var npc_query = db.collection('players').where('npc', '==', true);
  return npc_query.get().then(async function (querySnapshot) {
    querySnapshot.forEach(async function(doc) {
      await deleteNpc(doc.id)
    });
  })
}

async function deleteNpc(id) {
  await deleteFromCollectionById('players', id)
  await deleteCollection(`accounts/${id}/transactions`, 20)
  await deleteFromCollectionById('accounts', id)
  return await deleteFromCollectionById('playerCaps', id)
}

async function deleteFromCollectionById(collection, id) {
  return db.collection(collection).doc(id).delete()
}

async function deleteCollection(collection, batchSize) {
  var collectionRef = db.collection(collection);
  var query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise(async (resolve, reject) => {
    await deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

async function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  return await query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      var batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    }).then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}

init()
