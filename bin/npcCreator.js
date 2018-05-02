const logger = require('../server/dist/lib/logger')
const fantasyNames = require('fantasy-names')('star_wars', 'mandalorians', 1)
const util = require('../server/dist/lib/util')
const admin = require('firebase-admin')
const uuidv4 = require('uuid/v4')
const Chance = require('chance')
const args = process.argv.slice(2)
const FieldValue = admin.firestore.FieldValue
const chance = new Chance()

const starWarsSpecies = ["Anzatis", "Biths", "Bothans", "Devaronians", "Falleens", "Gamorreans", "Gands", "Grans", "Jawas", "Rodians", "Sullustans", "Wookiees"]
const starWarsSpeciesImages = {
    "Anzatis": [
        'npc_f1.jpg', 'npc_f2.jpg', 'npc_f3.jpg', 'npc_m1.jpg', 'npc_m2.jpg', 'npc_m3.jpg' 
    ],
    "Biths": [
        'npc_f1.jpg', 'npc_f2.jpg', 'npc_m1.jpg', 'npc_m2.jpg' 
    ],
    "Bothans": [
        'npc_f1.jpg', 'npc_f2.jpg', 'npc_m1.jpg', 'npc_m2.jpg' 
    ],
    "Devaronians": [
        'npc_f1.jpg', 'npc_f2.jpg', 'npc_f3.jpg', 'npc_f4.jpg', 'npc_m1.jpg', 'npc_m2.jpg', 'npc_m3.jpg', 'npc_m4.jpg'          
    ],
    "Falleens": [
        'npc_f1.jpg', 'npc_f2.jpg', 'npc_f3.jpg', 'npc_f4.jpg', 'npc_m1.jpg', 'npc_m2.jpg', 'npc_m3.jpg', 'npc_m4.jpg'          
    ],
    "Gamorreans": [
      'npc_f1.jpg', 'npc_f2.jpg', 'npc_m1.jpg', 'npc_m2.jpg' 
    ],
    "Gands": [
      'npc_f1.jpg', 'npc_f2.jpg', 'npc_m1.jpg', 'npc_m2.jpg' 
    ],
    "Grans": [
      'npc_f1.jpg', 'npc_f2.jpg', 'npc_f3.jpg', 'npc_f4.jpg', 'npc_f5.jpg', 'npc_f6.jpg', 'npc_m1.jpg', 'npc_m2.jpg', 'npc_m3.jpg', 'npc_m4.jpg', 'npc_m5.jpg', 'npc_m6.jpg'
    ],
    "Jawas": [
      'npc_f1.jpg', 'npc_f2.jpg', 'npc_f3.jpg', 'npc_f4.jpg', 'npc_f5.jpg', 'npc_m1.jpg', 'npc_m2.jpg', 'npc_m3.jpg', 'npc_m4.jpg', 'npc_m5.jpg'
    ],
    "Rodians": [
      'npc_f1.jpg', 'npc_f2.jpg', 'npc_f3.jpg', 'npc_f4.jpg', 'npc_f5.jpg', 'npc_f6.jpg', 'npc_m1.jpg', 'npc_m2.jpg', 'npc_m3.jpg', 'npc_m4.jpg', 'npc_m5.jpg', 'npc_m6.jpg'
    ],
    "Sullustans": [
      'npc_f1.jpg', 'npc_f2.jpg', 'npc_f3.jpg', 'npc_f4.jpg', 'npc_m1.jpg', 'npc_m2.jpg', 'npc_m3.jpg', 'npc_m4.jpg'          
    ],
    "Wookiees": [
      'npc_f1.jpg', 'npc_f2.jpg', 'npc_f3.jpg', 'npc_f4.jpg', 'npc_f5.jpg', 'npc_f6.jpg', 'npc_f7.jpg', 'npc_m1.jpg', 'npc_m2.jpg', 'npc_m3.jpg', 'npc_m4.jpg', 'npc_m5.jpg', 'npc_m6.jpg', 'npc_m7.jpg'
    ]

}
const genders = [ 'male', 'female']


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
      console.log(fantasyNames)
    for (var i=0;i < args[0];i++) {
        const randomUid = uuidv4()
        await createNewPlayer(randomUid, randomUid, true)
    }
  } catch (error) {
    console.log(error)
  }
}

async function createNewPlayer(uid, accessToken, isNpc) {
  try {
    const baseStats = rollBaseStats()
    const playerValue = util.calculatePlayerValue(baseStats)
    let swcCharacter = {
        character: generateNpcCharacter()
    }

    const playerEntity = {
      name: swcCharacter.character.name + ' NPC',
      image: swcCharacter.character.image,
      gender: swcCharacter.character.gender,
      race: swcCharacter.character.race.value,
      created: FieldValue.serverTimestamp(),
      swcPlayerUid: uid,
      passing: baseStats.passing,
      throwing: baseStats.throwing,
      blocking: baseStats.blocking,
      toughness: baseStats.toughness,
      morale: baseStats.morale,
      vision: baseStats.vision,
      leadership: baseStats.leadership,
      aggression: baseStats.aggression,
      endurance: baseStats.endurance,
      energy: baseStats.energy,
      marketValue: playerValue.marketValue,
      rating: playerValue.playerRating,
      npc: true
    }
    const newPlayer = await db.collection('players').add(playerEntity)
    await db.collection('players').doc(newPlayer.id).update({
      shockballPlayerUid: newPlayer.id
    })
    await createPlayerStatCaps(newPlayer.id)
    await createPlayerAccount(newPlayer.id, playerEntity)
    return await db.collection('players').doc(newPlayer.id).get().then(doc => {
      return doc.data()
    })
  } catch (error) {
    logger.error(error)
    return false
  }
}

function generateNpcCharacter() {
  let npc = {
    name: 'Tophat Jones NPC',
    image: 'data:image/jpeg;base64,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',
    gender: 'male',
    race: {
        value: 'leprechaun'
    } 
  } 
  const randomSpecies = starWarsSpecies[Math.floor(Math.random()*starWarsSpecies.length)];
  const generatedName = require('fantasy-names')('star_wars', randomSpecies, 1)[0]
  const generatedImage = starWarsSpeciesImages[randomSpecies][Math.floor(Math.random()*starWarsSpeciesImages[randomSpecies].length)]

  npc.name = toTitleCase(generatedName)
  npc.image = '../img/races/' + randomSpecies + '/' + generatedImage
  npc.gender = Math.floor(Math.random()*genders.length)
  npc.race.value = randomSpecies.slice(0, -1);

  return npc
}

function rollBaseStats() {
  const baseStats = {
    passing: chance.integer({
      min: 40,
      max: 60
    }),
    throwing: chance.integer({
      min: 40,
      max: 60
    }),
    blocking: chance.integer({
      min: 40,
      max: 60
    }),
    toughness: chance.integer({
      min: 40,
      max: 60
    }),
    endurance: chance.integer({
      min: 40,
      max: 60
    }),
    vision: chance.integer({
      min: 40,
      max: 60
    }),
    morale: chance.integer({
      min: 70,
      max: 100
    }),
    leadership: chance.integer({
      min: 10,
      max: 80
    }),
    aggression: 0,
    energy: chance.integer({
      min: 70,
      max: 100
    })
  }
  return baseStats
}

async function createPlayerAccount(playerId, player) {
  await db.collection('accounts').doc(playerId).set({
    shockballPlayerUid: playerId,
    name: player.name,
    created: FieldValue.serverTimestamp(),
    lastModified: FieldValue.serverTimestamp(),
    totalBalance: 0
  })
  await db.collection('accounts').doc(playerId).collection('transactions').add({
    activityType: 'Player account created for ' + player.name,
    timestamp: FieldValue.serverTimestamp(),
    amount: 0
  })
}

async function createPlayerStatCaps(uid) {
  const playerWithStatCaps = {
    shockballPlayerUid: uid,
    created: FieldValue.serverTimestamp(),
    passing: chance.integer({
      min: 75,
      max: 100
    }),
    throwing: chance.integer({
      min: 75,
      max: 100
    }),
    blocking: chance.integer({
      min: 75,
      max: 100
    }),
    toughness: chance.integer({
      min: 75,
      max: 100
    }),
    endurance: chance.integer({
      min: 75,
      max: 100
    }),
    vision: chance.integer({
      min: 75,
      max: 100
    })
  }
  return await db.collection('playerCaps').doc(uid).set(playerWithStatCaps)
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

init()
