// lib folder is for code files where there aren't much (or any) dependencies and can be imported on a file by file basis
//es6+ javascript selected! Can delete this comment
function reverseString(stringValue) {
  let reversedString = ''
  for (let character of stringValue) {
    reversedString = character + reversedString
  }
  return reversedString
}

function testPromise() {
  const promise = new Promise((resolve, reject) => {
    const data = {
      data: 'somestuff'
    }
    try {
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
  return promise
}

function calculatePlayerValue(playerStats) {
  const baseStats = {
    blocking: playerStats.blocking,
    endurance: playerStats.endurance,
    leadership: playerStats.leadership,
    passing: playerStats.passing,
    throwing: playerStats.throwing,
    toughness: playerStats.toughness,
    vision: playerStats.vision
  }
  let playerValue = {
    marketValue: 0,
    playerRating: 0
  }
  let numberStats = 0
  let totalStatValueCount = 0
  for (const [key, value] of Object.entries(baseStats)) { // eslint-disable-line no-unused-vars
    numberStats++
    totalStatValueCount += value
  }
  playerValue.playerRating = Math.floor(totalStatValueCount / numberStats)
  playerValue.marketValue = Math.floor(playerValue.playerRating * 1.6 * 60000)
  return playerValue
}

function generateSummaryRecords(events) {
  //season, matches, goals, passes, blocks, tackles, goalAverage
  const currentSeasonEvents = getSeasonRecords('1', events)
  let playerRecords = [{
    season: '1',
    // events: getSeasonRecords('1', currentSeasonEvents),
    matches: countMatches(currentSeasonEvents),
    goals: getActivityTypeCount('goal', currentSeasonEvents),
    shots: getActivityTypeCount('shoots', currentSeasonEvents),
    passes: getActivityTypeCount('passes ball', currentSeasonEvents),
    blocksPass: getActivityTypeCount('pass blocked', currentSeasonEvents),
    blocksShot: getActivityTypeCount('blocks shot', currentSeasonEvents),
    tackles: getActivityTypeCount('tackles', currentSeasonEvents),
    runsBall: getActivityTypeCount('runs ball', currentSeasonEvents),
    goalAverage: averageActivityPerMatch('goal', currentSeasonEvents)
  }]
  return playerRecords
}

function averageActivityPerMatch(activityType, events) {
  //formula (goals scored * game length in minutes) / total minutes played
  const totalGoals = getActivityTypeCount('goal', events)
  const gameLength = 70
  const totalMinutesPlayed = countMatches(events) * gameLength
  return (totalGoals * gameLength) / totalMinutesPlayed
}

function getActivityTypeCount(activityName, events) {
  let total = 0
  for (let record of events) {
    if (record.recordType === activityName) {
      total++
    }
  }
  return total
}

function getSeasonRecords(season, allEvents) {
  let seasonEvents = []
  for (let record of allEvents) {
    if (record.season === season) {
      seasonEvents.push(record)
    }
  }
  return seasonEvents
}

function countMatches(events) {
  const unique = [...new Set(events.map(event => event.fixtureId))]
  return unique.length
}

export {
  reverseString,
  testPromise,
  calculatePlayerValue,
  generateSummaryRecords,
  averageActivityPerMatch,
  getActivityTypeCount,
  getSeasonRecords,
  countMatches
}
