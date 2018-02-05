export default class Pitch {
  constructor(matchData) {
    this.state = 'before_kickoff'
    this.pitchOwnedBy = matchData.homeTeam.teamVenueName
    this.lastGoalSide = null
    this.secondHalf = false
    this.halfTime = 10000
    this.world = undefined
    this.goalResistence = {
      left: 2,
      right: 2
    }
    this.goalPit = {
      left: -5,
      right: 5
    }
  }

  checkRules(world) {
    this.world = world
  }

  update() {
  }

  reset() {
    this.changeState('before_kickoff')
  }

  isGoal() {
    //for now always score
    return true
  }

  changeState(state) {
    this.state = state
  }

}