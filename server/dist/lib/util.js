'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// lib folder is for code files where there aren't much (or any) dependencies and can be imported on a file by file basis
//es6+ javascript selected! Can delete this comment
function reverseString(stringValue) {
  var reversedString = '';
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = stringValue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var character = _step.value;

      reversedString = character + reversedString;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return reversedString;
}

function testPromise() {
  var promise = new Promise(function (resolve, reject) {
    var data = { data: 'somestuff' };
    try {
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
  return promise;
}

function generateSummaryRecords(events) {
  //season, matches, goals, passes, blocks, tackles, goalAverage
  var currentSeasonEvents = getSeasonRecords('1', events);
  console.log('current season events is');
  console.log(events);
  var playerRecords = [{
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
  }];
  return playerRecords;
}

function averageActivityPerMatch(activityType, events) {
  //formula (goals scored * game length in minutes) / total minutes played
  var totalGoals = getActivityTypeCount('goal', events);
  var gameLength = 70;
  var totalMinutesPlayed = countMatches(events) * gameLength;
  return totalGoals * gameLength / totalMinutesPlayed;
}

function getActivityTypeCount(activityName, events) {
  var total = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var record = _step2.value;

      if (record.recordType === activityName) {
        total++;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return total;
}

function getSeasonRecords(season, allEvents) {
  var seasonEvents = [];
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = allEvents[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var record = _step3.value;

      if (record.season === season) {
        seasonEvents.push(record);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return seasonEvents;
}

function countMatches(events) {
  var unique = [].concat(_toConsumableArray(new Set(events.map(function (event) {
    return event.fixtureId;
  }))));
  return unique.length;
}

exports.reverseString = reverseString;
exports.testPromise = testPromise;
exports.generateSummaryRecords = generateSummaryRecords;
exports.averageActivityPerMatch = averageActivityPerMatch;
exports.getActivityTypeCount = getActivityTypeCount;
exports.getSeasonRecords = getSeasonRecords;
exports.countMatches = countMatches;
//# sourceMappingURL=util.js.map