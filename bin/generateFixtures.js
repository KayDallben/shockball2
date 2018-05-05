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
    console.log(allFixtures)
  } catch (error) {
    console.log(error)
  }
}

async function generateFixtures() {
  const teams = await getAllTeams()
  let allTeamsFixtures = fixture(teams.length)
  let sortedFixtures = []
  let startingDate = moment(new Date()).add(numberDaysBetweenGames, 'days')
  for (var i=0;i < teams.length;i++) {
    for (var i=0;i < allTeamsFixtures.length;i++) {
      for (var y=0;y < allTeamsFixtures[i].matches.length;y++) {
        const opponentTeamIndex = allTeamsFixtures[i].matches[y].split('_')[1]
        sortedFixtures.push(await createFixture(teams[i], teams[opponentTeamIndex], startingDate))
        startingDate.add(numberDaysBetweenGames, 'days')
      }
      // startingDate = moment(new Date())
    }
  }
  sortedFixtures = shuffle(sortedFixtures)
  return sortedFixtures
}

// Schedule single round `j` for 'n' teams:
function round(n, j) {
  let m = n - 1;
  let round = Array.from({length: n}, (_, i) => (m + j - i) % m); // circular shift
  round[round[m] = j * (n >> 1) % m] = m; // swapping self-match
  return round;
}

// Schedule matches of 'n' teams:
function fixture(n) {
  let rounds = Array.from({length: n - 1}, (_, j) => round(n, j));
  return Array.from({length: n}, (_, i) => ({
    id: "Team_" + i,
    matches: rounds.map(round => "Team_" + round[i])
  }));
}

async function createFixture(homeTeam, awayTeam, gameDate) {
  let fixture = {
    homeTeam: homeTeam.teamUid,
    homeTeamName: homeTeam.teamName,
    homeTeamLogo: homeTeam.teamPicUrl,
    awayTeam: awayTeam.teamUid,
    awayTeamName: awayTeam.teamName,
    awayTeamLogo: awayTeam.teamPicUrl,
    homeTeamVenue: homeTeam.teamVenue,
    homeTeamVenueImage: homeTeam.teamVenueImage,
    gameDate: gameDate.toDate(),
    status: 'pending',
    startTime: gameDate.toDate(),
    season: leagueSeason
  }
  await db.collection('fixtures').add(fixture).then(async (ref) => {
    await db.collection('fixtures').doc(ref.id).update({
      fixtureId: ref.id,
      lastUpdated: FieldValue.serverTimestamp()
    })
  });
  return fixture
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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
