'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pitch = function () {
  function Pitch(matchData) {
    _classCallCheck(this, Pitch);

    this.state = 'before_kickoff';
    this.pitchOwnedBy = matchData.homeTeam.teamVenue;
    this.lastGoalSide = null;
    this.secondHalf = false;
    this.halfTime = 10000;
    this.world = undefined;
    this.goalResistence = {
      left: 2,
      right: 2
    };
    this.goalPit = {
      left: -5,
      right: 5
    };
  }

  _createClass(Pitch, [{
    key: 'checkRules',
    value: function checkRules(world) {
      this.world = world;
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'reset',
    value: function reset() {
      this.changeState('before_kickoff');
    }
  }, {
    key: 'isGoal',
    value: function isGoal() {
      //for now always score
      return true;
    }
  }, {
    key: 'changeState',
    value: function changeState(state) {
      this.state = state;
    }
  }]);

  return Pitch;
}();

exports.default = Pitch;
//# sourceMappingURL=pitch.js.map