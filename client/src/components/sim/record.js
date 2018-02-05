export default class Record {
  constructor() {
    this.records = []
  }

  update() {

  }

  endGame() {
    //send the records to the database!
  }

  add(player, gameEvent, gameTime) {

    player.opposingActorUid = player.opposingActorUid ? player.opposingActorUid : 'somebody'
    player.opposingActorFirstName = player.opposingActorFirstName ? player.opposingActorFirstName : 'somebody'
    
    this.records.push({
      actorUid: player.uid,
      actorFirstName: player.firstName,
      actorLastName: player.lastName,
      actorPicUrl: player.picUrl,
      opposingActorUid: player.opposingActorUid,
      opposingActorFirstName: player.opposingActorFirstName,
      teamUid: player.teamUid,
      teamName: player.teamName,
      teamPicUrl: player.teamPicUrl,
      recordRealTime: new Date().toString(),
      recordGameTime: gameTime,
      recordPitchSide: player.homeGoalSide,
      recordType: gameEvent,
      recordCommentator: this.getCommentatorText(player, gameEvent)
    })
  }

  getCommentatorText(player, gameEvent) {
    switch(gameEvent) {
      case 'tackles ball':
        return this.pickRandomTackleBall()
        break;
      case 'tackles':
        return this.pickRandomTacklePlayer(player)
        break;
      case 'runs ball':
        return this.pickRandomPlayerRun()
        break;
      case 'shoots':
        return this.pickRandomPlayerTryScore()
        break;
      case 'passes ball':
        return this.pickRandomPlayerTryPass()
        break;
      case 'goal':
        return this.pickRandomPlayerGoal(player)
        break;
      case 'goal blocked':
        return this.pickRandomPlayerGoalBlocked(player)
        break;
      case 'pass blocked':
        return this.pickRandomPlayerPassBlocked(player)
        break;
      default:
        ''
        break;
    }
  }

  pickRandomTackleBall() {
    const phrases = [
      'crashes in and emerges with the ball',
      'struggles to get free, but has the ball now!',
      'wins the tackle for the ball',
      'roughs up the opponent for the ball',
      'deftly snipes the ball from the opposition!'
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomTacklePlayer(player) {
    const phrases = [
      `hammers ${player.opposingActorFirstName} into the wall!`,
      `roughs up ${player.opposingActorFirstName}`,
      `smashes ${player.opposingActorFirstName} into the ground!`,
      `topples ${player.opposingActorFirstName} cleanly to ground`,
      `wipes the floor with ${player.opposingActorFirstName}`
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomPlayerRun() {
    const phrases = [
      'barrels down the court with the ball',
      'tucks and runs it in!',
      'is on a break away!',
      'is moving the ball nicely along',
      'carries the ball and ploughs through the opposition!'
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomPlayerTryScore() {
    const phrases = [
      'tries for a shot!',
      'puts up a heater!',
      'fires one toward goal',
      'blasts one towards the opposition goal!',
      'goes for the point, will it happen?'
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomPlayerGoal(player) {
    const phrases = [
      'rockets one into the pit!',
      'what a throw! It\'s in!',
      'and it\'s a great score!',
      'just slides by and in! Score!',
      `${player.opposingActorFirstName} couldn't stop the goal, mark one for ${player.teamName}!`,
      `slams the shockball past ${player.opposingActorFirstName} for the score!`
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomPlayerGoalBlocked(player) {
    const phrases = [
      `good try by ${player.opposingActorFirstName} but ${player.firstName} managed to block the shot`,
      `massive save against ${player.opposingActorFirstName}`,
      `blocks ${player.opposingActorFirstName}'s shot with ease`,
      `manages to get in front of a heater from ${player.opposingActorFirstName}`
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomPlayerTryPass() {
    const phrases = [
      'hands off the ball',
      'crosses the ball',
      'sends a firm throw to a teammate',
      'tosses the ball'
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  pickRandomPlayerPassBlocked(player) {
    const phrases = [
      `bats the shockball awary from ${player.opposingActorFirstName}`,
      `deflects the pass from ${player.opposingActorFirstName}`,
      `blocks ${player.opposingActorFirstName}'s pass with ease`,
      `${player.opposingActorFirstName}'s pass is easily batted away`
    ]
    return phrases[Math.floor(Math.random()*phrases.length)];
  }

  reset() {
    this.records = []
  }

}