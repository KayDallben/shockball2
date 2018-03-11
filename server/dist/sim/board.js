'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
  function Board(matchData, pitch, maxGameTime) {
    _classCallCheck(this, Board);

    this.leftTeamName = matchData.homeTeam.teamName || '???';
    this.rightTeamName = matchData.awayTeam.teamName || '???';
    this.leftScore = 0;
    this.rightScore = 0;
    this.gameTime = 0;
    this.maxGameTime = maxGameTime;
    this.startTime = new Date();
    this.pitch = pitch;
  }

  _createClass(Board, [{
    key: 'update',
    value: function update() {
      if (this.pitch.state === 'play_on') {
        this.gameTime++;
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.gameTime = 0;
    }
  }, {
    key: 'addScore',
    value: function addScore(side) {
      if (side === 'right') {
        this.rightScore++;
      } else {
        this.leftScore++;
      }
    }
  }]);

  return Board;
}();

exports.default = Board;
//# sourceMappingURL=board.js.map