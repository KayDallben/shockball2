import Chance from 'chance'
const chance = new Chance()
chance.mixin({
  'player': function(teamUid, teamName, teamPicUrl) {
    return {
      shockballPlayerUid: chance.guid(),
      name: 'BOT ' + chance.first({ nationality: 'nl'}) + ' ' + chance.last({ nationality: 'nl'}),
      image: chance.avatar(),
      teamUid: teamUid,
      teamName: teamName,
      teamPicUrl: teamPicUrl,
      role: chance.pickone(['Guard', 'Center', 'Wing']),
      passing: chance.integer({ min: 0, max: 30 }),
      toughness: chance.integer({ min: 0, max: 30 }),
      throwing: chance.integer({ min: 0, max: 30 }),
      energy: chance.integer({ min: 50, max: 100 }),
      endurance: chance.integer({ min: 0, max: 100 }),
      vision: chance.integer({ min: 0, max: 30}),
      blocking: chance.integer({ min: 0, max: 30})
    }
  }
})

export default class BotGenerator {
  constructor() {
    this.bots = []
  }


  create(teamUid, teamName, teamPicUrl) {
    const bot = chance.player(teamUid, teamName, teamPicUrl)
    this.bots.push(bot)
    return bot
  }

}