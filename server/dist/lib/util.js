'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
    var data = {
      data: 'somestuff'
    };
    try {
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
  return promise;
}

function calculatePlayerValue(playerStats) {
  var baseStats = {
    blocking: playerStats.blocking,
    endurance: playerStats.endurance,
    leadership: playerStats.leadership,
    passing: playerStats.passing,
    throwing: playerStats.throwing,
    toughness: playerStats.toughness,
    vision: playerStats.vision
  };
  var playerValue = {
    marketValue: 0,
    playerRating: 0
  };
  var numberStats = 0;
  var totalStatValueCount = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.entries(baseStats)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2),
          key = _step2$value[0],
          value = _step2$value[1];

      // eslint-disable-line no-unused-vars
      numberStats++;
      totalStatValueCount += value;
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

  playerValue.playerRating = Math.floor(totalStatValueCount / numberStats);
  playerValue.marketValue = Math.floor(playerValue.playerRating * 1.6 * 60000);
  return playerValue;
}

function generateSummaryRecords(events) {
  //season, matches, goals, passes, blocks, tackles, goalAverage
  var currentSeasonEvents = getSeasonRecords('1', events);
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
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = events[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var record = _step3.value;

      if (record.recordType === activityName) {
        total++;
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

  return total;
}

function getSeasonRecords(season, allEvents) {
  var seasonEvents = [];
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = allEvents[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var record = _step4.value;

      if (record.season === season) {
        seasonEvents.push(record);
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
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
exports.calculatePlayerValue = calculatePlayerValue;
exports.generateSummaryRecords = generateSummaryRecords;
exports.averageActivityPerMatch = averageActivityPerMatch;
exports.getActivityTypeCount = getActivityTypeCount;
exports.getSeasonRecords = getSeasonRecords;
exports.countMatches = countMatches;
//# sourceMappingURL=util.js.map