import Main from './main'
import World from './world'
import Player from './player'
import Pitch from './pitch'
import Board from './board'
import Ball from './ball'
import Record from './record'
// import MatchData from './matchData'

export function runMatch(serverMatchData, db) {
  // const matchData = new MatchData()
  const record = new Record(serverMatchData.fixtureId)
  const fps = 5
  const maxGameTime = 70
  let main = new Main(serverMatchData, World, Player, Pitch, Board, Ball, record)
  main.beginGame(fps, maxGameTime, db)
}
