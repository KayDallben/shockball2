const logger = require('../server/dist/lib/logger')
const fantasyNames = require('fantasy-names')('star_wars', 'mandalorians', 1)
const util = require('../server/dist/lib/util')
const admin = require('firebase-admin')
const uuidv4 = require('uuid/v4')
const Chance = require('chance')
const args = process.argv.slice(2)
const FieldValue = admin.firestore.FieldValue
const chance = new Chance()

const starWarsSpecies = ["Anzatis", "Biths", "Bothans", "Devaronians", "Falleens"]
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
    name: 'Billy Joe Bobby Jones',
    image: 'http://i736.photobucket.com/albums/xx4/bpkennedy/norringtonfreelance.jpg',
    gender: 'male',
    race: {
        value: 'human'
    }
  } 
  const randomSpecies = starWarsSpecies[Math.floor(Math.random()*starWarsSpecies.length)];
  const generatedName = require('fantasy-names')('star_wars', randomSpecies, 1)[0]
  const generatedImage = starWarsSpeciesImages[randomSpecies][Math.floor(Math.random()*starWarsSpeciesImages[randomSpecies].length)]

  npc.name = toTitleCase(generatedName)
  npc.image = '../img/races/' + randomSpecies + '/' + generatedImage
  npc.gender = Math.floor(Math.random()*genders.length)
  npc.race.value = randomSpecies

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
