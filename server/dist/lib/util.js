'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports.reverseString = reverseString;
exports.testPromise = testPromise;
//# sourceMappingURL=util.js.map