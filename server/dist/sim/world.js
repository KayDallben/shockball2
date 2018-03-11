'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = new _util2.default();

var World = function () {
  function World() {
    _classCallCheck(this, World);

    this.objects = [];
    this.leftPlayers = [];
    this.rightPlayers = [];
  }

  _createClass(World, [{
    key: 'register',
    value: function register(object) {
      if (util.getType(object) === '[object Object]') {
        this.objects.push(object);
      }
    }
  }, {
    key: 'update',
    value: function update() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var worldObject = _step.value;

          if (worldObject.update) {
            worldObject.update();
          }
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
    }
  }, {
    key: 'switchSides',
    value: function switchSides() {
      var oldRightPlayers = this.rightPlayers;
      var oldLeftPlayers = this.leftPlayers;
      this.rightPlayers = oldLeftPlayers;
      this.leftPlayers = oldRightPlayers;
    }
  }]);

  return World;
}();

exports.default = World;
//# sourceMappingURL=world.js.map