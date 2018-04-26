import Util from './util'
import Player from './player'

const util = new Util()

export default class World {
  constructor() {
   this.objects = []
   this.leftPlayers = []
   this.leftBench = {
     Center: [],
     Wing: [],
     Guard: [],
     Sub: [],
     Inactive: []
   }
   this.rightPlayers = []
   this.rightBench = {
    Center: [],
    Wing: [],
    Guard: [],
    Sub: [],
    Inactive: []
   }
  }

  register(object) {
    if (util.getType(object) === '[object Object]') {
      this.objects.push(object)
    }
  }

  playerDeregister(object) {
    this.objects = this.objects.filter(function(worldObject) {
      return worldObject.shockballPlayerUid !== object.shockballPlayerUid;
    })
    if (object.homeGoalSide === 'left') {
      this.leftPlayers = this.leftPlayers.filter(function(leftPlayer) {
        return leftPlayer.shockballPlayerUid !== object.shockballPlayerUid
      })
    } else {
      this.rightPlayers = this.rightPlayers.filter(function(rightPlayer) {
        return rightPlayer.shockballPlayerUid !== object.shockballPlayerUid
      })
    }
  }

  update(challenge) {
    this.rechargeBenchPlayerEnergy()
    this.rotateIfEnergyThreshold(challenge)
    for (let worldObject of this.objects) {
      if (worldObject.update) {
        worldObject.update()
      }
    }
  }

  rechargeBenchPlayerEnergy() {
    const allLeftPlayers = [].concat(this.leftBench.Center, this.leftBench.Wing, this.leftBench.Guard, this.leftBench.Sub, this.leftBench.Inactive)
    const allRightPlayers = [].concat(this.rightBench.Center, this.rightBench.Wing, this.rightBench.Guard, this.rightBench.Sub, this.rightBench.Inactive)
    for (let player of allLeftPlayers) {
      const playerEnduranceModifier = player.endurance / 100
      if (player.energy + (10 * playerEnduranceModifier) < 100) {
        player.energy = player.energy + (10 * playerEnduranceModifier)
      } else {
        player.energy = 100
      }
    }
    for (let player of allRightPlayers) {
      const playerEnduranceModifier = player.endurance / 100
      if (player.energy + (10 * playerEnduranceModifier) < 100) {
        player.energy = player.energy + (10 * playerEnduranceModifier)
      } else {
        player.energy = 100
      }
    }
  }

  rotateIfEnergyThreshold(challenge) {
    const defaultThreshold = 10
    for (let player of this.leftPlayers) {
      if (player.energy <= defaultThreshold) {
        this.trySwapLinePlayer(player, challenge, this.objects[1].gameTime)
      }
    }
    for (let player of this.rightPlayers) {
      if (player.energy <= defaultThreshold) {
        this.trySwapLinePlayer(player, challenge, this.objects[1].gameTime)
      }
    }
  }

  trySwapLinePlayer(player, challenge, gameTime) {
    const playerToSub = this.getNextRoleFromBench(player.homeGoalSide, player.role)
    if (playerToSub) {
      //we only sub if there is a player on the bench to sub in!
      this.subOutPlayer(player)
      this.subInPlayer(playerToSub)
      challenge.record.add(player, 'player rotation', gameTime, this.objects[2].goalProximity)
    }
  }

  getNextRoleFromBench(side, role) {
    if (side === 'left') {
      if (this.leftBench[role][0]) {
        return this.leftBench[role][0]
      }
    } else {
      if (this.rightBench[role][0]) {
        return this.rightBench[role][0]
      }
    }
  }

  subInPlayer(player) {
    this.register(player)
    if (player.homeGoalSide === 'left') {
      this.removeFromBench('left', player)
      this.addToField('left', player)
    } else {
      this.removeFromBench('right', player)
      this.addToField('right', player)
    }
  }

  subOutPlayer(player) {
    this.playerDeregister(player)
    if (player.homeGoalSide === 'left') {
      this.removeFromField('left', player)
      this.addToBench('left', player)
    } else {
      this.removeFromField('right', player) 
      this.addToBench('right', player)
    }
  }

  removeFromBench(side, player) {
    if (side === 'left') {
      this.leftBench[player.role] = this.leftBench[player.role].filter((benchPlayer) => {
        return benchPlayer.shockballPlayerUid !== player.shockballPlayerUid
      })
    } else {
      this.rightBench[player.role] = this.rightBench[player.role].filter((benchPlayer) => {
        return benchPlayer.shockballPlayerUid !== player.shockballPlayerUid
      })
    }
  }

  removeFromField(side, player) {
    if (side === 'left') {
      this.leftPlayers = this.leftPlayers.filter((fieldedPlayer) => {
        return fieldedPlayer.shockballPlayerUid !== player.shockballPlayerUid
      })
    } else {
      this.rightPlayers = this.rightPlayers.filter((fieldedPlayer) => {
        return fieldedPlayer.shockballPlayerUid !== player.shockballPlayerUid
      })
    }
  }

  addToField(side, player) {
    player.role = this.ensureRole(side, player)
    if (side === 'left') {
      this.leftPlayers.push(player)
    } else {
      this.rightPlayers.push(player)
    }
  }

  addToBench(side, player) {
    const playerRole = player.role ? player.role : 'Inactive'
    if (side === 'left') {
      this.leftBench[playerRole].push(player)
    } else {
      this.rightBench[playerRole].push(player)
    }
  }

  ensureRole(side, currentPlayer) {
    let playerRole = currentPlayer.role
    if (playerRole === undefined) {
      const sidePlayers = side + 'Players'
      const doesCenterExist = this[sidePlayers].find((player) => { return player.role === 'Center' })
      const wings = this[sidePlayers].filter((player) => { return player.role === 'Wing' })
      const doesGuardExist = this[sidePlayers].find((player) => { return player.role === 'Guard' })
      if (!doesCenterExist) {
        playerRole = 'Center'
      } else if (!doesGuardExist) {
        playerRole = 'Guard'
      } else if (wings.length < 2) {
        playerRole = 'Wing'
      }
    }
    return playerRole
  }

  switchSides() {
    const oldRightPlayers = this.rightPlayers
    const oldRightBench = this.rightBench
    const oldLeftPlayers = this.leftPlayers
    const oldLeftBench = this.leftBench

    this.rightPlayers = oldLeftPlayers
    this.rightBench = oldLeftBench
    this.leftPlayers = oldRightPlayers
    this.leftBench = oldRightBench
  }

}