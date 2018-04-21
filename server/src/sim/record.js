export default class Record {
  constructor(fixtureId, season) {
    this.records = []
    this.fixtureId = fixtureId
    this.season = season
    this.counter = 0
  }

  update() {

  }

  endGame() {
    //send the records to the database!
  }

  add(player, gameEvent, gameTime) {

    player.opposingActorUid = player.opposingActorUid ? player.opposingActorUid : 'somebody'
    player.opposingActorName = player.opposingActorName ? player.opposingActorName : 'somebody'

    this.records.push({
      actorUid: player.shockballPlayerUid,
      actorName: player.name,
      actorPicUrl: player.image,
      opposingActorUid: player.opposingActorUid,
      opposingActorName: player.opposingActorName,
      teamUid: player.teamUid,
      teamName: player.teamName,
      teamPicUrl: player.teamPicUrl,
      recordRealTime: new Date().toString(),
      recordGameTime: gameTime,
      recordPitchSide: player.homeGoalSide,
      recordType: gameEvent,
      recordCommentator: this.getCommentatorText(player, gameEvent),
      fixtureId: this.fixtureId,
      season: this.season
    })
  }

  getCommentatorText(player, gameEvent) {
    switch (gameEvent) {
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
      case 'player rotation':
        return this.rotatePlayer()
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
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  pickRandomTacklePlayer(player) {
    const phrases = [
      `hammers ${player.opposingActorName} into the wall!`,
      `roughs up ${player.opposingActorName}`,
      `smashes ${player.opposingActorName} into the ground!`,
      `topples ${player.opposingActorName} cleanly to ground`,
      `wipes the floor with ${player.opposingActorName}`
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  rotatePlayer() {
    const phrases = [
      'is getting tired and is being rotated out',
      'can\'t keep up, time for a swap',
      'is coming off the pitch',
      'looks out of breath and needs to come off'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  pickRandomPlayerRun() {
    const phrases = [
      'barrels down the court with the ball',
      'tucks and runs it in!',
      'is on a break away!',
      'is moving the ball nicely along',
      'carries the ball and ploughs through the opposition!'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  pickRandomPlayerTryScore() {
    const phrases = [
      'tries for a shot!',
      'puts up a heater!',
      'fires one toward goal',
      'blasts one towards the opposition goal!',
      'goes for the point, will it happen?'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  pickRandomPlayerGoal(player) {
    const phrases = [
      'rockets one into the pit!',
      'what a throw! It\'s in!',
      'and it\'s a great score!',
      'just slides by and in! Score!',
      `${player.opposingActorName} couldn't stop the goal, mark one for ${player.teamName}!`,
      `slams the shockball past ${player.opposingActorName} for the score!`
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  pickRandomPlayerGoalBlocked(player) {
    const phrases = [
      `good try by ${player.opposingActorName} but ${player.name} managed to block the shot`,
      `massive save against ${player.opposingActorName}`,
      `blocks ${player.opposingActorName}'s shot with ease`,
      `manages to get in front of a heater from ${player.opposingActorName}`
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  pickRandomPlayerTryPass() {
    const phrases = [
      'hands off the ball',
      'crosses the ball',
      'sends a firm throw to a teammate',
      'tosses the ball'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  pickRandomPlayerPassBlocked(player) {
    const phrases = [
      `bats the shockball awary from ${player.opposingActorName}`,
      `deflects the pass from ${player.opposingActorName}`,
      `blocks ${player.opposingActorName}'s pass with ease`,
      `${player.opposingActorName}'s pass is easily batted away`
    ]
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  reset() {
    this.records = []
  }

}
