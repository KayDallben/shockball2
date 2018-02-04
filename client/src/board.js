export default class Board {
  constructor(pitch, maxGameTime) {
    this.leftTeamName = "???"
    this.rightTeamName = "???"
    this.leftScore = 0
    this.rightScore = 0
    this.gameTime = 0
    this.maxGameTime = maxGameTime
    this.startTime = new Date()
    this.pitch = pitch
  }

  update() {
    if (this.pitch.state === 'play_on') {
      this.gameTime++
    }
  }

  reset() {
    this.gameTime = 0
  }

  addScore(side) {
    if (side === 'right') {
      this.rightScore++
    } else {
      this.leftScore++
    }
  }

}