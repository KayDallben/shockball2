'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chance = new _chance2.default();
var util = new _util2.default();

var Player = function () {
  function Player(playerStats, world, challenge, homeGoalSide) {
    _classCallCheck(this, Player);

    if (util.getType(playerStats) === '[object Object]') {
      this.createdAsUid = playerStats.createdAsUid;
      this.name = playerStats.name;
      this.image = playerStats.image;
      this.teamUid = playerStats.teamUid;
      this.teamName = playerStats.teamName;
      this.teamPicUrl = playerStats.teamPicUrl;
      this.role = playerStats.role;
      this.passing = playerStats.passing;
      this.toughness = playerStats.toughness;
      this.throwing = playerStats.throwing;
      this.fatigue = playerStats.fatigue;
      this.endurance = playerStats.endurance;
      this.vision = playerStats.vision;
      this.blocking = playerStats.blocking;
      this.homeGoalSide = homeGoalSide;
      this.challenge = challenge;
      this.realWorldModel = world;
      this.playerWorldModel = {
        objects: [],
        leftPlayers: [],
        rightPlayers: []
      };
    } else {
      throw new Error('Cannot create Player: incorrect param data types');
    }
  }

  _createClass(Player, [{
    key: 'update',
    value: function update() {
      this.applyEffects();
      this.think(); //should set player's perception of world model via player's skills
      this.takeAction();
    }
  }, {
    key: 'applyEffects',
    value: function applyEffects() {
      // let's increase fatigue according to endurance stat
      this.fatigue += this.endurance / 100;
      // high morale should equal a small netBuff
      // high aggro should equal a small netBuff but also increase chance of injury
    }
  }, {
    key: 'think',
    value: function think() {
      //we start with the real world model
      var gameObjects = this.realWorldModel.objects;
      //we wipe away the player's old percieved world model
      this.playerWorldModel.objects = [];
      this.playerWorldModel.leftPlayers = [];
      this.playerWorldModel.rightPlayers = [];

      // we will do calulcations here to modify based on Perception skill of this unique player's Perception attribute
      // for now, let's assume this player is godlike and his perception is exactly the reality of the world

      // player's perception of the pitch - what is the state of the game
      var pitch = gameObjects[0];
      this.playerWorldModel.objects.push(pitch);
      // board probably isn't relevant to perception/reality, but we need it for the array order
      var board = gameObjects[1];
      this.playerWorldModel.objects.push(board);
      // player's perception of the ball - where it's at, who has it, how close to goal
      var ball = gameObjects[2];
      this.playerWorldModel.objects.push(ball);
      // player's perception of other players
      var leftPlayers = this.realWorldModel.leftPlayers;
      var rightPlayers = this.realWorldModel.rightPlayers;
      this.playerWorldModel.leftPlayers = leftPlayers;
      this.playerWorldModel.rightPlayers = rightPlayers;

      // now we have rebuilt the playerWorldModel the way this unique player interprets it, hopefuly granting more agency for his/her actions
    }
  }, {
    key: 'takeAction',
    value: function takeAction() {
      var gameObjects = this.playerWorldModel.objects;
      var pitch = gameObjects[0];
      var board = gameObjects[1];
      var ball = gameObjects[2];
      if (pitch.state === 'before_kickoff') {
        // we are before kickoff so player wants to get the ball
        this.tryTackleBall();
        return;
      }
      if (pitch.state === 'play_on' && ball.possessedBy === this.createdAsUid) {
        // this player has the ball - better trying priority 1 action first!
        // player looks to score first, if he's in range.
        // for now the goal is empty and it has a default resistence of 2
        // for now the goalPosition (default 5) minus the goalProximity must be less than the goal resistence (default 2)
        var thinksHasScoreChance = this.analyzeCanScore(ball, pitch);
        if (thinksHasScoreChance) {
          this.tryScore(pitch, board, ball);
          return;
        } else {
          // so he doesn't think he can score, so now move to priority 2 action - getting ball closer to scoring via pass or run
          // for now this player thinks "if my throwing + passing is lower than my toughness then I'll run.  otherwise I'll pass"
          var thinksCanPass = this.analyzeCanPass();
          if (thinksCanPass) {
            this.tryPass();
            return;
          } else {
            this.tryRun(pitch, ball);
            return;
          }
        }
      } else if (pitch.state === 'play_on' && ball.possessedBy !== null && ball.lastSideTouched === this.homeGoalSide) {
        // Ball is being carried by a player of my team
      } else if (pitch.state === 'play_on' && ball.possessedBy !== null && ball.lastSideTouched !== this.homeGoalSide) {
        // Ball is being carried by a player of other team

        var thinksMoreLikelyToShoot = null;
        var actionGuess = null;
        if (this.homeGoalSide === 'right') {
          //Player first decides: will ball handler throw or run?
          actionGuess = this.analyzeNextAction(this.playerWorldModel.leftPlayers, ball);
          if (actionGuess === 'throw') {
            //Player now checks if more likely to shoot or pass
            thinksMoreLikelyToShoot = this.analyzeMoreLikelyToShoot(this.playerWorldModel.leftPlayers, ball);
            if (thinksMoreLikelyToShoot) {
              this.tryBlockShot();
            } else {
              this.tryBlockPass();
            }
          } else {
            this.tryTacklePlayer();
          }
        } else {
          //Player first decides: will ball handler throw or run?
          actionGuess = this.analyzeNextAction(this.playerWorldModel.rightPlayers, ball);
          if (actionGuess === 'throw') {
            //Player now checks if more likely to shoot or pass
            thinksMoreLikelyToShoot = this.analyzeMoreLikelyToShoot(this.playerWorldModel.rightPlayers, ball);
            if (thinksMoreLikelyToShoot) {
              this.tryBlockShot();
            } else {
              this.tryBlockPass();
            }
          } else {
            this.tryTacklePlayer();
          }
        }
      } else if (pitch.state === 'play_on' && ball.possessedBy === null) {
        // Ball is has been fumbled during play and is free
      }
    }
  }, {
    key: 'analyzeNextAction',
    value: function analyzeNextAction(opposingPlayers, ball) {
      var ballCarrier = opposingPlayers.find(function (player) {
        return player.createdAsUid === ball.possessedBy;
      });
      if (ballCarrier.throwing + ballCarrier.passing > ballCarrier.toughness + chance.rpg('1d12', { sum: true })) {
        return 'throw';
      } else {
        return 'run';
      }
    }
  }, {
    key: 'analyzeMoreLikelyToShoot',
    value: function analyzeMoreLikelyToShoot(players, ball) {
      var ballCarrier = players.find(function (player) {
        return player.createdAsUid === ball.possessedBy;
      });
      //simple determinatin right now - if throwing higher than passing, then this player assumes they'll shoot
      if (ballCarrier && ballCarrier.throwing > ballCarrier.passing) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'analyzeCanScore',
    value: function analyzeCanScore(ball, pitch) {
      var targetGoalResistence = pitch.goalResistence[this.homeGoalSide];
      if (this.homeGoalSide === 'left') {
        if (pitch.goalPit.right - ball.goalProximity < targetGoalResistence) {
          return true;
        } else {
          return false;
        }
      } else if (this.homeGoalSide === 'right') {
        if (Math.abs(pitch.goalPit.left - ball.goalProximity) < targetGoalResistence) {
          return true;
        } else {
          return false;
        }
      }
    }
  }, {
    key: 'analyzeCanPass',
    value: function analyzeCanPass() {
      if (this.throwing + this.passing > this.toughness + chance.rpg('1d12', { sum: true })) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'tryScore',
    value: function tryScore(pitch, board, ball) {
      this.challenge.addTryScore(this);
    }
  }, {
    key: 'tryPass',
    value: function tryPass() {
      this.challenge.addTryPass(this);
    }
  }, {
    key: 'tryRun',
    value: function tryRun(pitch, ball) {
      this.challenge.addTryRun(this);
    }
  }, {
    key: 'tryTackleBall',
    value: function tryTackleBall() {
      this.challenge.addTackleBall(this);
    }
  }, {
    key: 'tryTacklePlayer',
    value: function tryTacklePlayer() {
      this.challenge.addTryTacklePlayer(this);
    }
  }, {
    key: 'tryBlockPass',
    value: function tryBlockPass() {
      this.challenge.addTryPass(this);
    }
  }, {
    key: 'tryBlockShot',
    value: function tryBlockShot() {
      this.challenge.addTryScore(this);
    }
  }]);

  return Player;
}();

exports.default = Player;
//# sourceMappingURL=player.js.map