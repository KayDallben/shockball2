'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _player3 = require('./player');

var _player4 = _interopRequireDefault(_player3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = new _util2.default();

var World = function () {
  function World() {
    _classCallCheck(this, World);

    this.objects = [];
    this.leftPlayers = [];
    this.leftBench = {
      Center: [],
      Wing: [],
      Guard: [],
      Sub: [],
      Inactive: []
    };
    this.rightPlayers = [];
    this.rightBench = {
      Center: [],
      Wing: [],
      Guard: [],
      Sub: [],
      Inactive: []
    };
  }

  _createClass(World, [{
    key: 'register',
    value: function register(object) {
      if (util.getType(object) === '[object Object]') {
        this.objects.push(object);
      }
    }
  }, {
    key: 'playerDeregister',
    value: function playerDeregister(object) {
      this.objects = this.objects.filter(function (worldObject) {
        return worldObject.shockballPlayerUid !== object.shockballPlayerUid;
      });
      if (object.homeGoalSide === 'left') {
        this.leftPlayers = this.leftPlayers.filter(function (leftPlayer) {
          return leftPlayer.shockballPlayerUid !== object.shockballPlayerUid;
        });
      } else {
        this.rightPlayers = this.rightPlayers.filter(function (rightPlayer) {
          return rightPlayer.shockballPlayerUid !== object.shockballPlayerUid;
        });
      }
    }
  }, {
    key: 'update',
    value: function update(challenge) {
      this.rechargeBenchPlayerEnergy();
      this.rotateIfEnergyThreshold(challenge);
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
    key: 'rechargeBenchPlayerEnergy',
    value: function rechargeBenchPlayerEnergy() {
      var allLeftPlayers = [].concat(this.leftBench.Center, this.leftBench.Wing, this.leftBench.Guard, this.leftBench.Sub, this.leftBench.Inactive);
      var allRightPlayers = [].concat(this.rightBench.Center, this.rightBench.Wing, this.rightBench.Guard, this.rightBench.Sub, this.rightBench.Inactive);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = allLeftPlayers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var player = _step2.value;

          var playerEnduranceModifier = player.endurance / 100;
          if (player.energy + 10 * playerEnduranceModifier < 100) {
            player.energy = player.energy + 10 * playerEnduranceModifier;
          } else {
            player.energy = 100;
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

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = allRightPlayers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _player = _step3.value;

          var _playerEnduranceModifier = _player.endurance / 100;
          if (_player.energy + 10 * _playerEnduranceModifier < 100) {
            _player.energy = _player.energy + 10 * _playerEnduranceModifier;
          } else {
            _player.energy = 100;
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
    }
  }, {
    key: 'rotateIfEnergyThreshold',
    value: function rotateIfEnergyThreshold(challenge) {
      var defaultThreshold = 10;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.leftPlayers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var player = _step4.value;

          if (player.energy <= defaultThreshold) {
            this.trySwapLinePlayer(player, challenge, this.objects[1].gameTime);
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

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.rightPlayers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _player2 = _step5.value;

          if (_player2.energy <= defaultThreshold) {
            this.trySwapLinePlayer(_player2, challenge, this.objects[1].gameTime);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: 'trySwapLinePlayer',
    value: function trySwapLinePlayer(player, challenge, gameTime) {
      var playerToSub = this.getNextRoleFromBench(player.homeGoalSide, player.role);
      if (playerToSub) {
        //we only sub if there is a player on the bench to sub in!
        this.subOutPlayer(player);
        this.subInPlayer(playerToSub);
        challenge.record.add(player, 'player rotation', gameTime);
      }
    }
  }, {
    key: 'getNextRoleFromBench',
    value: function getNextRoleFromBench(side, role) {
      if (side === 'left') {
        if (this.leftBench[role][0]) {
          return this.leftBench[role][0];
        }
      } else {
        if (this.rightBench[role][0]) {
          return this.rightBench[role][0];
        }
      }
    }
  }, {
    key: 'subInPlayer',
    value: function subInPlayer(player) {
      this.register(player);
      if (player.homeGoalSide === 'left') {
        this.removeFromBench('left', player);
        this.addToField('left', player);
      } else {
        this.removeFromBench('right', player);
        this.addToField('right', player);
      }
    }
  }, {
    key: 'subOutPlayer',
    value: function subOutPlayer(player) {
      this.playerDeregister(player);
      if (player.homeGoalSide === 'left') {
        this.removeFromField('left', player);
        this.addToBench('left', player);
      } else {
        this.removeFromField('right', player);
        this.addToBench('right', player);
      }
    }
  }, {
    key: 'removeFromBench',
    value: function removeFromBench(side, player) {
      if (side === 'left') {
        this.leftBench[player.role] = this.leftBench[player.role].filter(function (benchPlayer) {
          return benchPlayer.shockballPlayerUid !== player.shockballPlayerUid;
        });
      } else {
        this.rightBench[player.role] = this.rightBench[player.role].filter(function (benchPlayer) {
          return benchPlayer.shockballPlayerUid !== player.shockballPlayerUid;
        });
      }
    }
  }, {
    key: 'removeFromField',
    value: function removeFromField(side, player) {
      if (side === 'left') {
        this.leftPlayers = this.leftPlayers.filter(function (fieldedPlayer) {
          return fieldedPlayer.shockballPlayerUid !== player.shockballPlayerUid;
        });
      } else {
        this.rightPlayers = this.rightPlayers.filter(function (fieldedPlayer) {
          return fieldedPlayer.shockballPlayerUid !== player.shockballPlayerUid;
        });
      }
    }
  }, {
    key: 'addToField',
    value: function addToField(side, player) {
      player.role = this.ensureRole(side, player);
      if (side === 'left') {
        this.leftPlayers.push(player);
      } else {
        this.rightPlayers.push(player);
      }
    }
  }, {
    key: 'addToBench',
    value: function addToBench(side, player) {
      var playerRole = player.role ? player.role : 'Inactive';
      if (side === 'left') {
        this.leftBench[playerRole].push(player);
      } else {
        this.rightBench[playerRole].push(player);
      }
    }
  }, {
    key: 'ensureRole',
    value: function ensureRole(side, currentPlayer) {
      var playerRole = currentPlayer.role;
      if (playerRole === undefined) {
        var sidePlayers = side + 'Players';
        var doesCenterExist = this[sidePlayers].find(function (player) {
          return player.role === 'Center';
        });
        var wings = this[sidePlayers].filter(function (player) {
          return player.role === 'Wing';
        });
        var doesGuardExist = this[sidePlayers].find(function (player) {
          return player.role === 'Guard';
        });
        if (!doesCenterExist) {
          playerRole = 'Center';
        } else if (!doesGuardExist) {
          playerRole = 'Guard';
        } else if (wings.length < 2) {
          playerRole = 'Wing';
        }
      }
      return playerRole;
    }
  }, {
    key: 'switchSides',
    value: function switchSides() {
      var oldRightPlayers = this.rightPlayers;
      var oldRightBench = this.rightBench;
      var oldLeftPlayers = this.leftPlayers;
      var oldLeftBench = this.leftBench;

      this.rightPlayers = oldLeftPlayers;
      this.rightBench = oldLeftBench;
      this.leftPlayers = oldRightPlayers;
      this.leftBench = oldRightBench;
    }
  }]);

  return World;
}();

exports.default = World;
//# sourceMappingURL=world.js.map