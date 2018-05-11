//arg 0 should be number games per team to play
//arg 1 should be number of days between games
//arg 2 should be the league season for the games

const admin = require('firebase-admin')
const moment = require('moment')

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
const numberGamesPerTeam = args[0] ? args[0] : 1
const numberDaysBetweenGames = args[1] ? args[1] : 3
const leagueSeason = args[2] ? args[2].toString() : '1'

async function init() {
  try {
    const allFixtures = await generateFixtures()
    await writeFixtures(allFixtures)
  } catch (error) {
    console.log(error)
  }
}

async function generateFixtures() {
  const teams = await getAllTeams()
  let allTeamsFixtures = makeFixtures(teams)
  return allTeamsFixtures
}

function makeFixtures(teams) {
  let allTeams = teams
  let fixtures = []
  let halfWayThough = Math.floor(allTeams.length / 2)
  let arrayFirstHalf = allTeams.slice(0, halfWayThough)
  let arraySecondHalf = allTeams.slice(halfWayThough, allTeams.length)
  arraySecondHalf.reverse()
  fixtures = createMatchups(arrayFirstHalf, arraySecondHalf)
  return fixtures
}

function createMatchups(leftHalf, rightHalf) {
  let dynamicOrderLeftHalf = JSON.parse(JSON.stringify(leftHalf))
  let dynamicOrderRightHalf = JSON.parse(JSON.stringify(rightHalf))
  let allMatches = []
  for (var i=0;i < ((dynamicOrderLeftHalf.length + dynamicOrderRightHalf.length) * 2);i++) {
    for (var y=0; y < dynamicOrderLeftHalf.length;y++) {
      allMatches.push(newMatch(dynamicOrderLeftHalf[y],dynamicOrderRightHalf[y], i+1))
    }
    let rightZeroIndex = dynamicOrderRightHalf.shift()
    dynamicOrderLeftHalf.splice(1, 0, rightZeroIndex)
    let leftEndIndex = dynamicOrderLeftHalf.pop()
    dynamicOrderRightHalf.push(leftEndIndex)
    if (i === (dynamicOrderLeftHalf.length + dynamicOrderRightHalf.length)) {
      const tempLeftHalf = JSON.parse(JSON.stringify(dynamicOrderLeftHalf))
      const tempRightHalf = JSON.parse(JSON.stringify(dynamicOrderRightHalf))
      dynamicOrderLeftHalf = tempRightHalf
      dynamicOrderRightHalf = tempLeftHalf
    }
  }
  return allMatches
}

function newMatch(leftTeam, rightTeam, dayMultiplier) {
  let gameDate = moment(new Date()).add(numberDaysBetweenGames * dayMultiplier, 'days')
  let match = {
    homeTeam: leftTeam.teamUid,
    homeTeamName: leftTeam.teamName,
    homeTeamLogo: leftTeam.teamPicUrl,
    awayTeam: rightTeam.teamUid,
    awayTeamName: rightTeam.teamName,
    awayTeamLogo: rightTeam.teamPicUrl,
    homeTeamVenue: leftTeam.teamVenue ? leftTeam.teamVenue : '',
    homeTeamVenueImage: leftTeam.teamVenueImage ? leftTeam.teamVenueImage : '',
    gameDate: gameDate.toDate(),
    status: 'pending',
    startTime: gameDate.toDate(),
    season: leagueSeason
  }
  return match
}

async function writeFixtures(allFixtures) {
  for (let fixture of allFixtures) {
    await db.collection('fixtures').add(fixture).then(async (ref) => {
      await db.collection('fixtures').doc(ref.id).update({
        fixtureId: ref.id,
        lastUpdated: FieldValue.serverTimestamp()
      })
    })
  }
}

async function getAllTeams() {
  const teams = []
  await db.collection('teams').get().then((querySnapshot) => {
    querySnapshot.forEach(async (doc) => {
      teams.push(doc.data())
    })
  })
  return teams
}

init()
