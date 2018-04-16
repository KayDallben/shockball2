import Util from './util'
const util = new Util()

export default class World {
  constructor() {
   this.objects = []
   this.leftPlayers = []
   this.leftBench = []
   this.rightPlayers = []
   this.rightBench = []
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

  update() {
    for (let worldObject of this.objects) {
      if (worldObject.update) {
        worldObject.update()
      }
    }
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