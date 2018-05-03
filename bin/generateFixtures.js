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
const numberDaysBetweenGames = args[1] ? args[1] : 7
const leagueSeason = args[2] ? args[2].toString() : '1'

async function init() {
  try {
    await generateFixtures()
  } catch (error) {
    console.log(error)
  }
}

async function generateFixtures() {
  const teams = await getAllTeams()
  for (let team of teams) {
    await createFixturesPerTeam(team, teams, moment(new Date()))
  }

}

async function createFixturesPerTeam(team, teams, startingDate) {
  const awayTeams = teams.filter(oneTeam => oneTeam.teamUid !== team.teamUid);
  for (let awayTeam of awayTeams) {
    for (var i=0;i < numberGamesPerTeam;i++) {
      await createFixture(team, awayTeam, startingDate)
      startingDate.add(numberDaysBetweenGames, 'days')
    }
  }
}

async function createFixture(homeTeam, awayTeam, gameDate) {
  await db.collection('fixtures').add({
    homeTeam: homeTeam.teamUid,
    homeTeamName: homeTeam.teamName,
    homeTeamLogo: homeTeam.teamPicUrl,
    awayTeam: awayTeam.teamUid,
    awayTeamName: awayTeam.teamName,
    awayTeamLogo: awayTeam.teamPicUrl,
    homeTeamVenue: homeTeam.teamVenue,
    homeTeamVenueImage:homeTeam.teamVenueImage,
    gameDate: gameDate.toDate(),
    status: 'pending',
    startTime: gameDate.toDate(),
    season: leagueSeason
  }).then(async (ref) => {
    await db.collection('fixtures').doc(ref.id).update({
      fixtureId: ref.id,
      lastUpdated: FieldValue.serverTimestamp()
    })
  });
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
