import * as admin from 'firebase-admin'

import Challenge from './challenge'
import BotGenerator from './botGenerator'
import Util from './util'

let botGenerator = new BotGenerator()
let challenge = null // will set once this.record is available
const util = new Util()
const FieldValue = admin.firestore.FieldValue

export default class Main {
  constructor(matchData, World, Player, Pitch, Board, Ball, record) {
    this.stopSim = false
    this.now = Date.now()
    this.then = Date.now()
    this.fps = 1000
    this.maxGameTime = 70
    this.elapsed = null
    this.matchData = matchData
    this.World = World
    this.Player = Player
    this.Pitch = Pitch
    this.Board = Board
    this.Ball = Ball
    this.record = record
    this.counter = 0
    this.db = null
  }

  beginGame(framesPerSecond, maxGameTime, db) {
    if (util.getType(framesPerSecond) === '[object Number]') {
      this.db = db
      challenge = new Challenge(this.record)
      this.fps = framesPerSecond
      this.maxGameTime = maxGameTime ? maxGameTime : this.maxGameTime
      //register world
      this.world = new this.World()

      //register pitch
      const pitch = new this.Pitch(this.matchData)
      this.world.register(pitch)

      //register scoreboard
      const board = new this.Board(this.matchData, pitch, this.maxGameTime)
      this.world.register(board)

      //register ball
      const ball = new this.Ball(pitch)
      this.world.register(ball)

      this.createWorldHumanPlayers(this.world, challenge)
      this.createWorldNpcPlayers(this.world, challenge)

      //start main game loop
      this.mainLoop()
    } else {
      throw new Error('Cannot start game: incorrect param data types')
    }
  }

  mainLoop() {
    if (this.stopSim) {
      return
    }
    this.now = Date.now()
    this.elapsed = this.now - this.then

    if (this.elapsed > this.fps) {
      this.update()
      this.then = this.now - (this.elapsed % this.fps)
    }
    // window.requestAnimationFrame(this.mainLoop.bind(this))
    setImmediate(this.mainLoop.bind(this))
  }

  update() {
    this.counter++
    try {
      this.world.update(challenge)
    } catch (error) {
      console.log(error)
    }
    
    challenge.update(this.world)
    challenge.reset()
    
    if (this.world.objects[1]['gameTime'] === this.maxGameTime) {
      this.stopSim = true
      this.writeMatchRecords(this.world)
    }
  }

  createWorldHumanPlayers(world, challenge) {
    // register home team players on left side
    for (let player of this.matchData.homeTeam.players) {
      const playerToAdd = new this.Player(player, world, challenge, 'left')
      if (playerToAdd.role !== undefined) {
        if (['center1', 'left1', 'right1', 'guard1'].indexOf(playerToAdd.lineupPosition) >= 0) {
          world.register(playerToAdd)
          world.addToField('left', playerToAdd)
        } else if (['center2', 'left2', 'right2', 'guard2', 'sub1', 'sub2'].indexOf(playerToAdd.lineupPosition) >= 0) {
          world.addToBench('left', playerToAdd)
        }
      }
    }
    
    // register away team players on right side
    for (let player of this.matchData.awayTeam.players) {
      const playerToAdd = new this.Player(player, world, challenge, 'right')
      if (playerToAdd.role !== undefined) {
        if (['center1', 'left1', 'right1', 'guard1'].indexOf(playerToAdd.lineupPosition) >= 0) {
          world.register(playerToAdd)
          world.addToField('right', playerToAdd)
        } else if (['center2', 'left2', 'right2', 'guard2', 'sub1', 'sub2'].indexOf(playerToAdd.lineupPosition) >= 0) {
          world.addToBench('right', playerToAdd)
        }
      }
    }
  }

  createWorldNpcPlayers(world, challenge) {
    // create bots for teams lacking players
    let totalHomeTeamFieldSize = world.leftPlayers.length
    let totalHomeTeamBenchSize = world.leftBench.Center.length + world.leftBench.Wing.length + world.leftBench.Guard.length + world.leftBench.Sub.length
    const totalHomeTeamSize = totalHomeTeamFieldSize + totalHomeTeamBenchSize

    let totalAwayTeamFieldSize = world.rightPlayers.length
    let totalAwayTeamBenchSize = world.rightBench.Center.length + world.rightBench.Wing.length + world.rightBench.Guard.length + world.rightBench.Sub.length
    const totalAwayTeamSize = totalAwayTeamFieldSize + totalAwayTeamBenchSize

    // if (this.matchData.homeTeam.players.length < 4) {
    if (totalHomeTeamSize < 10) {
      for (var i = totalHomeTeamSize; i < 10; i++) {
        const bot = botGenerator.create(this.matchData.homeTeam.id, this.matchData.homeTeam.teamName, this.matchData.homeTeam.teamPicUrl)
        const playerToAdd = new this.Player(bot, world, challenge, 'left')
        if (totalHomeTeamFieldSize < 4) {
          world.register(playerToAdd)
          world.addToField('left', playerToAdd)
          totalHomeTeamFieldSize++
        } else if (totalHomeTeamBenchSize < 6) {
          world.addToBench('left', playerToAdd)
          totalHomeTeamBenchSize++
        }
      }
    }

    // create bots for teams lacking players
    if (totalAwayTeamSize < 10) {
      for (var o = totalAwayTeamSize; o < 10; o++) {
        const bot = botGenerator.create(this.matchData.awayTeam.id, this.matchData.awayTeam.teamName, this.matchData.awayTeam.teamPicUrl)
        const playerToAdd = new this.Player(bot, world, challenge, 'right')
        if (totalAwayTeamFieldSize < 4) {
          world.register(playerToAdd)
          world.addToField('right', playerToAdd)
          totalAwayTeamFieldSize++
        } else if (totalAwayTeamBenchSize < 6) {
          world.addToBench('right', playerToAdd)
          totalAwayTeamBenchSize++
        }
      }
    }
  }

  writeMatchRecords(world) {
    this.savePlayerRecords(this.record.records)
    this.saveTeamRecords(world)
  }

  saveTeamRecords(world) {
    const gameResults = {
      homeTeamScore: world.objects[1]['leftScore'],
      homeTeamName: world.objects[1]['leftTeamName'],
      awayTeamScore: world.objects[1]['rightScore'],
      awayTeamName: world.objects[1]['rightTeamName'],
      startTime: world.objects[1]['startTime'],
      lastUpdated: FieldValue.serverTimestamp(),
      status: 'complete'
    }
    this.db.collection('fixtures').doc(this.matchData.fixtureId).update(gameResults)
  }

  savePlayerRecords(events) {
    let batch = this.db.batch()
    events.forEach(record => {
      record.fixtureId = this.matchData.fixtureId
      const ref = this.db.collection('events').doc()
      batch.set(ref, record)
    })

    batch.commit()
  }

}