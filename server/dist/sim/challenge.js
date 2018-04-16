'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chance = new _chance2.default();

var Challenge = function () {
  function Challenge(record) {
    _classCallCheck(this, Challenge);

    this.world = null;
    this.pitch = null;
    this.board = null;
    this.ball = null;
    this.leftPlayers = null;
    this.rightPlayers = null;
    this.tackleBall = [];
    this.playerTryRun = [];
    this.playerTryScore = [];
    this.playerTryPass = [];
    this.playerTryTackle = [];
    this.record = record;
  }

  _createClass(Challenge, [{
    key: 'update',
    value: function update(world) {
      this.world = world;
      this.pitch = this.world.objects[0];
      this.board = this.world.objects[1];
      this.ball = this.world.objects[2];
      this.leftPlayers = this.world.leftPlayers;
      this.rightPlayers = this.world.rightPlayers;
      if (this.tackleBall.length > 0) {
        this.resolveTackleBall();
      }
      if (this.playerTryRun.length > 0) {
        this.resolvePlayerRun();
      }
      if (this.playerTryScore.length > 0) {
        this.resolvePlayerTryScore();
      }
      if (this.playerTryPass.length > 0) {
        this.resolvePlayerTryPass();
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.tackleBall = [];
      this.playerTryRun = [];
      this.playerTryScore = [];
      this.playerTryPass = [];
      this.playerTryTackle = [];
    }
  }, {
    key: 'addTackleBall',
    value: function addTackleBall(player) {
      this.tackleBall.push(player);
    }
  }, {
    key: 'addTryRun',
    value: function addTryRun(player) {
      this.playerTryRun.push(player);
    }
  }, {
    key: 'addTryScore',
    value: function addTryScore(player) {
      this.playerTryScore.push(player);
    }
  }, {
    key: 'addTryPass',
    value: function addTryPass(player) {
      this.playerTryPass.push(player);
    }
  }, {
    key: 'addTryTacklePlayer',
    value: function addTryTacklePlayer(player) {
      this.playerTryTackle.push(player);
    }
  }, {
    key: 'resolveTackleBall',
    value: function resolveTackleBall() {
      // here would be a struggle between whoever else on the field for control of the ball, or shot block, or pass interception/block, after winning the encounter, .possess is called
      // for now the Toughness attribute determines who wins the Tackle
      // for now we look at each player vying to tackle the ball, and add their Toughness and a random dice roll - highest wins
      this.tackleBall.map(function (player) {
        player.tackleScore = player.toughness + chance.rpg('2d6', { sum: true });
      });
      var highestTackleScore = Math.max.apply(Math, this.tackleBall.map(function (player) {
        return player.tackleScore;
      }));
      var winningPlayer = this.tackleBall.find(function (player) {
        return player.tackleScore === highestTackleScore;
      });
      this.record.add(winningPlayer, 'tackles ball', this.board.gameTime);
      this.ball.possess(winningPlayer.shockballPlayerUid);
      this.ball.lastSideTouched = winningPlayer.homeGoalSide;
      this.ball.lastPlayerTouched = winningPlayer.shockballPlayerUid;
    }
  }, {
    key: 'resolvePlayerRun',
    value: function resolvePlayerRun() {
      // here the player THINKS he can ran, but in reality he'd have challengers.
      // for now, he is unhindered
      var theBall = this.ball;
      var runningPlayer = this.playerTryRun.find(function (player) {
        return player.shockballPlayerUid === theBall.possessedBy;
      });

      //first player needs to beat tackle challenges from opposition, if there are any
      if (this.playerTryTackle.length > 0) {
        //we'll pick one at random for now
        var randomTackler = chance.pickone(this.playerTryTackle, 1);
        var tacklerScore = randomTackler.toughness + randomTackler.vision + chance.rpg('2d6', { sum: true });
        var runningPlayerScore = runningPlayer.toughness + runningPlayer.vision + chance.rpg('2d6', { sum: true });
        if (runningPlayerScore > tacklerScore) {
          this.runForward(runningPlayer);
        } else {
          //gets tackled
          this.getsTackled(runningPlayer, randomTackler, theBall);
        }
      } else {
        this.runForward(runningPlayer);
      }
    }
  }, {
    key: 'resolvePlayerTryScore',
    value: function resolvePlayerTryScore() {
      // here is where the player THINKS he can score so he TRIES, and it's where reality kicks in and other players are attempting to block/stop/intercept him.
      // for now, there are no other players so he's free to proceed unhindered, will write logic for challenging later
      var theBall = this.ball;
      var shootingPlayer = this.playerTryScore.find(function (player) {
        return player.shockballPlayerUid === theBall.possessedBy;
      });

      if (!shootingPlayer) {
        // if there is no shooting player then it could be because the ballhandler didn't actually try to shoot (thus isn't in the array) but a player THOUGHT
        // that he might based on their playerWorldModel understanding!  Basically he got it wrong.  :).  So we return out of this function altogether.
        // if (this.pitch.state !== 'play_on') {
        //   this.gameStateReset(theBall)
        // }
        return;
      }

      var attackingSide = shootingPlayer.homeGoalSide === 'left' ? 'right' : 'left';
      //this is the shot attempt, make a record
      this.record.add(shootingPlayer, 'shoots', this.board.gameTime);
      //we now need to calculate if he scored or missed/was blocked
      // we do a blanket probability of 60/30/10 for blocking by Guard then Wing and then Center.
      var probability = Math.random();
      var opposingPlayer = undefined;
      if (probability < 0.4) {
        // Guard tries block action and if he fails, shooter is able to shoot
        opposingPlayer = this.playerTryScore.find(function (player) {
          return player.homeGoalSide === attackingSide && player.role === 'Guard';
        });
      } else if (probability < 0.6) {
        // Wing tries block action and if he fails, shooter is able to shoot
        opposingPlayer = this.playerTryScore.find(function (player) {
          return player.homeGoalSide === attackingSide && player.role === 'Wing';
        });
      } else {
        // Center tries block action and if he fails, shooter is able to shoot
        opposingPlayer = this.playerTryScore.find(function (player) {
          return player.homeGoalSide === attackingSide && player.role === 'Center';
        });
      }

      //we handle here if generated bots by chance didn't have the right positions (I am not enforcing alwaysa  Guard, Wing, Center)
      if (!opposingPlayer) {
        //kinda hacky!
        opposingPlayer = shootingPlayer;
      }

      var shootingScore = shootingPlayer.throwing + shootingPlayer.vision + chance.rpg('2d6', { sum: true });
      var blockingScore = opposingPlayer.blocking + opposingPlayer.vision + chance.rpg('2d6', { sum: true });

      if (shootingScore > blockingScore || shootingPlayer === opposingPlayer) {
        this.score(shootingPlayer, opposingPlayer, theBall);
      } else {
        // shooter is blocked
        this.goalBlock(shootingPlayer, opposingPlayer, theBall);
      }
    }
  }, {
    key: 'resolvePlayerTryPass',
    value: function resolvePlayerTryPass() {
      // player THINKS he can pass so he tries.  We will need to transfer the ball possession to another player on success.
      var theBall = this.ball;
      var leftPlayers = this.leftPlayers.slice();
      var rightPlayers = this.rightPlayers.slice();

      var passingPlayer = this.playerTryPass.find(function (player) {
        return player.shockballPlayerUid === theBall.possessedBy;
      });

      if (!passingPlayer) {
        //we need to return because ball has been fumbled and noone possesses it
        return;
      }

      //TODO make much better determination here!
      var attackingSide = passingPlayer.homeGoalSide === 'left' ? 'right' : 'left';
      var probability = Math.random();
      var opposingPlayer = undefined;
      if (probability < 0.4) {
        // Guard tries block action and if he fails, shooter is able to shoot
        opposingPlayer = this.playerTryPass.find(function (player) {
          return player.homeGoalSide === attackingSide && player.role === 'Guard';
        });
      } else if (probability < 0.6) {
        // Wing tries block action and if he fails, shooter is able to shoot
        opposingPlayer = this.playerTryPass.find(function (player) {
          return player.homeGoalSide === attackingSide && player.role === 'Wing';
        });
      } else {
        // Center tries block action and if he fails, shooter is able to shoot
        opposingPlayer = this.playerTryPass.find(function (player) {
          return player.homeGoalSide === attackingSide && player.role === 'Center';
        });
      }

      //we handle here if generated bots by chance didn't have the right positions (I am not enforcing always a Guard, Wing, Center)
      if (!opposingPlayer) {
        //kinda hacky!
        opposingPlayer = passingPlayer;
      }

      var passingScore = passingPlayer.passing + passingPlayer.vision + chance.rpg('2d6', { sum: true });
      var blockingScore = opposingPlayer.blocking + opposingPlayer.vision + chance.rpg('2d6', { sum: true });

      if (passingScore > blockingScore || passingPlayer === opposingPlayer) {
        //pass will be successful, now choose what teammate to pass to
        this.passForward(passingPlayer, theBall, leftPlayers, rightPlayers);
      } else {
        //passer is blocked
        this.passBlock(opposingPlayer, theBall);
      }
    }
  }, {
    key: 'score',
    value: function score(shootingPlayer, opposingPlayer, ball) {
      shootingPlayer.opposingActorUid = opposingPlayer.shockballPlayerUid;
      shootingPlayer.opposingActorName = opposingPlayer.name;
      this.record.add(shootingPlayer, 'goal', this.board.gameTime);
      this.addToScoreBoard(shootingPlayer);
      this.gameStateReset(ball);
    }
  }, {
    key: 'gameStateReset',
    value: function gameStateReset(ball) {
      ball.reset();
      this.pitch.state = 'before_kickoff';
      ball.lastSideTouched = null;
    }
  }, {
    key: 'addToScoreBoard',
    value: function addToScoreBoard(shootingPlayer) {
      this.board.addScore(shootingPlayer.homeGoalSide);
      this.pitch.lastGoalSide = shootingPlayer.homeGoalSide;
    }
  }, {
    key: 'goalBlock',
    value: function goalBlock(shootingPlayer, opposingPlayer, ball) {
      opposingPlayer.opposingActorUid = shootingPlayer.shockballPlayerUid;
      opposingPlayer.opposingActorName = shootingPlayer.name;
      this.record.add(opposingPlayer, 'goal blocked', this.board.gameTime);
      ball.possessedBy = opposingPlayer.shockballPlayerUid;
      ball.lastSideTouched = opposingPlayer.homeGoalSide;
    }
  }, {
    key: 'runForward',
    value: function runForward(runningPlayer) {
      if (Math.abs(this.ball.goalProximity) < Math.abs(this.pitch.goalPit[runningPlayer.homeGoalSide])) {
        if (runningPlayer.homeGoalSide === 'right') {
          this.record.add(runningPlayer, 'runs ball', this.board.gameTime);
          if (this.pitch.goalPit.left < this.ball.goalProximity) {
            this.ball.goalProximity--;
          }
        } else if (runningPlayer.homeGoalSide === 'left') {
          this.record.add(runningPlayer, 'runs ball', this.board.gameTime);
          if (this.pitch.goalPit.right > this.ball.goalProximity) {
            this.ball.goalProximity++;
          }
        }
      } else {
        // console.error('in this player run else')
      }
    }
  }, {
    key: 'passForward',
    value: function passForward(passingPlayer, ball, leftPlayers, rightPlayers) {
      if (passingPlayer.homeGoalSide === 'right') {
        var availableTeammates = rightPlayers.filter(function (player) {
          return player.shockballPlayerUid !== passingPlayer.shockballPlayerUid;
        });
        var playerToWinPossession = chance.pickone(availableTeammates, 1);
        this.record.add(passingPlayer, 'passes ball', this.board.gameTime);
        if (this.pitch.goalPit.left < ball.goalProximity) {
          ball.goalProximity--;
        }
        ball.possessedBy = playerToWinPossession.shockballPlayerUid;
      } else {
        var _availableTeammates = leftPlayers.filter(function (player) {
          return player.shockballPlayerUid !== passingPlayer.shockballPlayerUid;
        });
        var _playerToWinPossession = chance.pickone(_availableTeammates, 1);
        this.record.add(passingPlayer, 'passes ball', this.board.gameTime);
        if (this.pitch.goalPit.right > ball.goalProximity) {
          ball.goalProximity++;
        }
        ball.possessedBy = _playerToWinPossession.shockballPlayerUid;
      }
    }
  }, {
    key: 'passBlock',
    value: function passBlock(opposingPlayer, ball) {
      this.record.add(opposingPlayer, 'pass blocked', this.board.gameTime);
      ball.lastSideTouched = opposingPlayer.homeGoalSide;
      ball.possessedBy = opposingPlayer.shockballPlayerUid;
    }
  }, {
    key: 'getsTackled',
    value: function getsTackled(runningPlayer, randomTackler, ball) {
      randomTackler.opposingActorUid = runningPlayer.shockballPlayerUid;
      randomTackler.opposingActorName = runningPlayer.name;
      this.record.add(randomTackler, 'tackles', this.board.gameTime);
      ball.possess(randomTackler.shockballPlayerUid);
      ball.lastSideTouched = randomTackler.homeGoalSide;
      ball.lastPlayerTouched = randomTackler.shockballPlayerUid;
    }
  }]);

  return Challenge;
}();

exports.default = Challenge;
//# sourceMappingURL=challenge.js.map