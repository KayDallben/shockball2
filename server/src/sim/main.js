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
    this.world.update()
    challenge.update(this.world)
    challenge.reset()

    // **** simulating a player coming off the pitch
    // if (this.counter.toString() === '7') {
    //   this.world.playerDeregister({ shockballPlayerUid: 'F6FknRwa6SPEbF1azKYU', homeGoalSide: 'left'})
    // }

    // **** simulating a player coming on the pitch
    // if (this.counter.toString() === '8') {
    //   const examplePlayer = {
    //     shockballPlayerUid: 'F6FknRwa6SPEbF1azKYU',
    //     name: 'Callisto Xaltir',
    //     image: 'http://custom.swcombine.com/static/1/1232616-100-100.jpg?1328204107',
    //     teamUid: '4dt21p2M1q7WmjjwJHfw',
    //     teamName: 'Abregado Gentlemen',
    //     teamPicUrl: 'https://i.pinimg.com/736x/3a/55/2f/3a552f7be8e2675a16f3e4effa6d075a--bulldog-mascot-mascot-design.jpg',
    //     lineupPosition: 'center1',
    //     role: 'Center',
    //     passing: 49.75,
    //     toughness: 45.75,
    //     throwing: 51.75,
    //     fatigue: 14.024999999999995,
    //     endurance: 46.75,
    //     vision: 40.75,
    //     blocking: 39.75
    //   }
    //   const playerToAdd = new this.Player(examplePlayer, this.world, challenge, 'left')
    //   this.world.register(playerToAdd)
    //   this.world.leftPlayers.push(playerToAdd)
    // }
    
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
          world.leftPlayers.push(playerToAdd)
        } else if (['center2', 'left2', 'right2', 'guard2', 'sub1', 'sub2'].indexOf(playerToAdd.lineupPosition) >= 0) {
          world.leftBench.push(playerToAdd)
        }
      }
    }
    
    // register away team players on right side
    for (let player of this.matchData.awayTeam.players) {
      const playerToAdd = new this.Player(player, world, challenge, 'right')
      if (playerToAdd.role !== undefined) {
        if (['center1', 'left1', 'right1', 'guard1'].indexOf(playerToAdd.lineupPosition) >= 0) {
          world.register(playerToAdd)
          world.rightPlayers.push(playerToAdd)
        } else if (['center2', 'left2', 'right2', 'guard2', 'sub1', 'sub2'].indexOf(playerToAdd.lineupPosition) >= 0) {
          world.rightBench.push(playerToAdd)
        }
      }
    }
  }

  createWorldNpcPlayers(world, challenge) {
    // create bots for teams lacking players
    const totalHomeTeamSize = world.leftPlayers.length + world.leftBench.length
    const totalAwayTeamSize = world.rightPlayers.length + world.rightBench.length
    // if (this.matchData.homeTeam.players.length < 4) {
    if (totalHomeTeamSize < 10) {
      for (var i = totalHomeTeamSize; i < 10; i++) {
        const bot = botGenerator.create(this.matchData.homeTeam.id, this.matchData.homeTeam.teamName, this.matchData.homeTeam.teamPicUrl)
        const playerToAdd = new this.Player(bot, world, challenge, 'left')
        if (world.leftPlayers.length < 4) {
          world.register(playerToAdd)
          world.leftPlayers.push(playerToAdd)
        } else if (world.leftBench.length < 6) {
          world.leftBench.push(playerToAdd)
        }
      }
    }

    // create bots for teams lacking players
    if (totalAwayTeamSize < 10) {
      for (var i = totalAwayTeamSize; i < 10; i++) {
        const bot = botGenerator.create(this.matchData.awayTeam.id, this.matchData.awayTeam.teamName, this.matchData.awayTeam.teamPicUrl)
        const playerToAdd = new this.Player(bot, world, challenge, 'right')
        if (world.rightPlayers.length < 4) {
          world.register(playerToAdd)
          world.rightPlayers.push(playerToAdd)
        } else if (world.rightBench.length < 6) {
          world.rightBench.push(playerToAdd)
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