//import simulation engine
import Main from './main'
import World from './world'
import Player from './player'
import Pitch from './pitch'
import Board from './board'
import Ball from './ball'
import Record from './record'
import MatchData from './matchData'
const moment = require('moment')

const matchData = new MatchData()
const record = new Record()
const fps = 3000
const maxGameTime = 70
let main

export const simComponent = {
  template: `
    <div>
      <div class="gameObject" ng-if="ctrl.showDebug">
        <pre>
          <json-tree json="simCtrl.game" collapsed-level="4" edit-level="low" timeout="0" timeoutInit="0"></json-tree>
        </pre>
      </div>
      <h1 class="header-title" ng-click="ctrl.showDebug = !ctrl.showDebug">Shockball Sim v0.1</h1>
      <div class="playByPlay">
        <div class="live-indicator" ng-if="simCtrl.isRunning">
          ON LIVE
          <div class="fa fa-clock-o"></div>
        </div>
        <div class="scoreboard">
          <div class="leftTeamLogo" back-opacity="0.9" back-img="{{simCtrl.leftPlayers[0]['teamPicUrl']}}"></div>
          <div class="rightTeamLogo" back-opacity="0.9" back-img="{{simCtrl.rightPlayers[0]['teamPicUrl']}}"></div>
          <div class="venue">
            <div class="viewerRelativeTime">{{simCtrl.matchViewerRelativeTime}}</div>
            <div class="matchLocation">{{::simCtrl.world[0]['pitchOwnedBy']}}</div>
          </div>
          <div class="teamNames">
            <div class="leftTeamName">{{simCtrl.leftPlayers[0]['teamName']}}</div>
            <div class="nameSpacer"> - </div>
            <div class="rightTeamName">{{simCtrl.rightPlayers[0]['teamName']}}</div>
          </div>
          <div class="scoreCount">
            <div class="leftTeamScore">
              {{simCtrl.world[1]['leftScore']}}
              <div class="leftTeamColor"></div>
            </div>
            <div class="gameTime">
              <round-progress
                max="` + maxGameTime + `"
                current="simCtrl.world[1]['gameTime']"
                color="#60CA82"
                bgcolor="#4C505B"
                radius="30"
                stroke="5"
                semi="false"
                rounded="true"
                clockwise="true"
                responsive="false"
                duration="` + fps + `"
                animation="linearEase"
                animation-delay="0">
              </round-progress>
              <div class="timeSpinner">
                {{simCtrl.world[1]['gameTime']}}'
              </div>
            </div>
            <div class="rightTeamScore">
              {{simCtrl.world[1]['rightScore']}}
              <div class="rightTeamColor"></div>
            </div>
          </div>
          <div class="ball-position">
            <rzslider rz-slider-model="simCtrl.world[2]['goalProximity']" rz-slider-options="simCtrl.sliderOptions"></rzslider>          
          </div>
        </div>
        <div class="timeline">
          <ul scroll-glue>
            <li ng-repeat="event in simCtrl.gameEvents" ng-class="{
                right: event.recordPitchSide === 'right',
                left: event.recordPitchSide === 'left',
                shot: event.recordType === 'shoots',
                pass: event.recordType === 'passes ball',
                run: event.recordType === 'runs ball',
                tackleBall: event.recordType === 'tackles ball',
                tacklePlayer: event.recordType === 'tackles',
                passBlocked: event.recordType === 'pass blocked',
                goalBlocked: event.recordType === 'goal blocked',
                goal: event.recordType === 'goal'
              }" class="play">
              <div class="eventTime">{{::event.recordGameTime}}'</div>
              <div class="event-info">
                <div class="name">{{::event.actorName}}</div>
                <div class="middleDot">&middot;</div>
                <div class="action">{{::event.recordType}}</div>
              </div>
              <div class="eventText">{{::event.recordCommentator}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  bindings: {},
  controllerAs: 'simCtrl',
  controller: class SimController {
    constructor($interval) {
      main = new Main(matchData, World, Player, Pitch, Board, Ball, record)
      main.beginGame(fps, maxGameTime)
      this.isRunning = false
      this.interval = $interval
      this.showDebug = false
      this.game = main
      this.gameInterval = null
      this.world = this.game.world.objects
      this.sliderOptions = {
        floor: -5,
        ceil: 5,
        disabled: true
      }
      this.leftPlayers = this.game.world.leftPlayers
      this.rightPlayers = this.game.world.rightPlayers
      this.gameEvents = record.records
      this.matchViewerRelativeTime = 'ON LIVE'
    }

    $onInit() {
      if (!this.isRunning) {
        this.isRunning = true
        this.startGameInterval()
      }
    }

    stopGameInterval() {
      this.interval.cancel(this.gameInterval)
    }

    startGameInterval() {
      this.stopGameInterval()
      this.gameInterval = this.interval(() => {
        if (this.game.stopSim) {
          this.matchViewerRelativeTime = moment(this.world[1]['startTime']).format('MMMM Do YYYY, h:mm:ss')
          this.isRunning = false
          this.stopGameInterval()
        }
      }, fps)
    }

    static get $inject() {
      return [
        '$interval'
      ]
    }
  }
}