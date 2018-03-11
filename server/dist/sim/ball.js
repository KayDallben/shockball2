'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ball = function () {
  function Ball(pitch) {
    _classCallCheck(this, Ball);

    this.lastPlayerTouched = null;
    this.lastSideTouched = null;
    this.possessedBy = null;
    this.lane = 'center'; //or "right" or "left"
    this.goalProximity = 0;
    this.pitch = pitch;
  }

  _createClass(Ball, [{
    key: 'update',
    value: function update() {}
  }, {
    key: 'reset',
    value: function reset() {
      this.goalProximity = 0;
      this.possessedBy = null;
      this.lastPlayerTouched = null;
      this.lane = 'center';
    }
  }, {
    key: 'possess',
    value: function possess(playerId) {
      this.possessedBy = playerId;
      this.pitch.state = 'play_on';
    }
  }]);

  return Ball;
}();

exports.default = Ball;
//# sourceMappingURL=ball.js.map