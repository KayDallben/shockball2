import Challenge from "./challenge"
import BotGenerator from './botGenerator'
import Util from './util'

let botGenerator = new BotGenerator()
let challenge = null // will set once this.record is available
const util = new Util()

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
  }

  beginGame(framesPerSecond, maxGameTime) {
    if (util.getType(framesPerSecond) === '[object Number]') {
      challenge = new Challenge(this.record)
      this.fps = framesPerSecond
      this.maxGameTime = maxGameTime ? maxGameTime : this.maxGameTime
      //register world
      this.world = new this.World()
      
      //register pitch
      const pitch = new this.Pitch(this.matchData)
      this.world.register(pitch)
      
      //register scoreboard
      const board = new this.Board(pitch, this.maxGameTime)
      this.world.register(board)
      
      //register ball
      const ball = new this.Ball(pitch)
      this.world.register(ball)


      //register home team players on left side
      // for (let player of this.matchData.homeTeam.players) {
      //   const playerToAdd = new this.Player(player, this.world, challenge, 'left')
      //   this.world.register(playerToAdd)
      //   this.world.leftPlayers.push(playerToAdd)
      // }
      
      //register away team players on right side
      // for (let player of this.matchData.awayTeam.players) {
      //   const playerToAdd = new this.Player(player, this.world, challenge, 'right')
      //   this.world.register(playerToAdd)
      //   this.world.rightPlayers.push(playerToAdd)
      // }

      for (var i = 0; i < 4; i++) {
        const bot = botGenerator.create('-KnGp3lbMpZVvl1bGGvy', 'Kashyyyk Rangers', 'https://vignette1.wikia.nocookie.net/limmierpg/images/4/42/Rangers.jpg/revision/latest?cb=20140503184850')
        const playerToAdd = new this.Player(bot, this.world, challenge, 'left')
        this.world.register(playerToAdd)
        this.world.leftPlayers.push(playerToAdd)
      }

      for (var i = 0; i < 4; i++) {
        const bot = botGenerator.create('-KnCepjY8BLF_0bcANzF', 'Abregado Gentlemen','http://www.brandcrowd.com/gallery/brands/thumbs/thumb14751184306802.jpg')
        const playerToAdd = new this.Player(bot, this.world, challenge, 'right')
        this.world.register(playerToAdd)
        this.world.rightPlayers.push(playerToAdd)
      }

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
  
    this.now = Date.now();
    this.elapsed = this.now - this.then
  
    if (this.elapsed > this.fps) {
      this.update()
      this.then = this.now - (this.elapsed % this.fps)
    }
    
    window.requestAnimationFrame(this.mainLoop.bind(this))
  }
  
  update() {
    this.world.update()
    challenge.update(this.world)
    challenge.reset()
    this.counter++
    if (this.counter.toString() === '5') {
      // this.stopSim = true
    }
    // console.log('counter is: ' + this.counter )
    if (this.world.objects[1]['gameTime'] === this.maxGameTime) {
      this.stopSim = true
      this.writeMatchRecords();
    }
  }

  writeMatchRecords() {
    console.log('match is over, lets write our records to the database here.  All match data should be: ')
    console.log(this.record)
  }

}