import angular from 'angular'
import angularSpinner from 'angular-svg-round-progressbar'
import angularJson from 'json-tree2'
import scrollGlue from 'angularjs-scroll-glue'
import angularSlider from 'angularjs-slider'
const moment = require('moment')

import Main from './main'
import World from './world'
import Player from './player'
import Pitch from './pitch'
import Board from './board'
import Ball from './ball'
import Record from './record'
import MatchData from './matchData'

const matchData = new MatchData()
const record = new Record()
const fps = 3000
const maxGameTime = 70

let main = new Main(matchData, World, Player, Pitch, Board, Ball, record)

main.beginGame(fps, maxGameTime)

// create the front-end ui with angular
var mainComponent = {
  controller: function ($scope, $interval){
    var ctrl = this;
    ctrl.isRunning = false;
    ctrl.showDebug = false;
    ctrl.game = main;
    ctrl.gameInterval = null;
    ctrl.world = ctrl.game.world.objects;
    ctrl.sliderOptions = {
      floor: ctrl.world[0]['goalPit']['left'],
      ceil: ctrl.world[0]['goalPit']['right'],
      disabled: true
    };
    ctrl.leftPlayers = ctrl.game.world.leftPlayers;
    ctrl.rightPlayers = ctrl.game.world.rightPlayers;
    ctrl.gameEvents = record.records;
    ctrl.matchViewerRelativeTime = 'ON LIVE';
    ctrl.setViewerRelativeTime = function() {
      if (ctrl.game.stopSim) {
        ctrl.matchViewerRelativeTime = moment(ctrl.world[1]['startTime']).format('MMMM Do YYYY, h:mm:ss');
        ctrl.isRunning = false;
        ctrl.stopGameInterval();
      }
    },
    ctrl.$onInit = function() {
      if (!ctrl.isRunning) {
        ctrl.isRunning = true;
        ctrl.startGameInterval();
      }
    },
    // stops the interval
    ctrl.stopGameInterval = function() {
      $interval.cancel(ctrl.gameInterval);
    },
    ctrl.startGameInterval = function() {
      ctrl.stopGameInterval();
      ctrl.gameInterval = $interval(ctrl.setViewerRelativeTime, fps);

    }
  },
  template: `
    <div>
      <div class="gameObject" ng-if="ctrl.showDebug">
        <pre>
          <json-tree json="$ctrl.game" collapsed-level="4" edit-level="low" timeout="0" timeoutInit="0"></json-tree>
        </pre>
      </div>
      <h1 class="header-title" ng-click="ctrl.showDebug = !ctrl.showDebug">Shockball Sim v0.1</h1>
      <div class="playByPlay">
        <div class="live-indicator" ng-if="$ctrl.isRunning">
          ON LIVE
          <div class="fa fa-clock-o"></div>
        </div>
        <div class="scoreboard">
          <div class="leftTeamLogo" back-img="{{$ctrl.leftPlayers[0]['teamPicUrl']}}"></div>
          <div class="rightTeamLogo" back-img="{{$ctrl.rightPlayers[0]['teamPicUrl']}}"></div>
          <div class="venue">
            <div class="viewerRelativeTime">{{$ctrl.matchViewerRelativeTime}}</div>
            <div class="matchLocation">{{::$ctrl.world[0]['pitchOwnedBy']}}</div>
          </div>
          <div class="teamNames">
            <div class="leftTeamName">{{$ctrl.leftPlayers[0]['teamName']}}</div>
            <div class="nameSpacer"> - </div>
            <div class="rightTeamName">{{$ctrl.rightPlayers[0]['teamName']}}</div>
          </div>
          <div class="scoreCount">
            <div class="leftTeamScore">
              {{$ctrl.world[1]['leftScore']}}
              <div class="leftTeamColor"></div>
            </div>
            <div class="gameTime">
              <round-progress
                max="` + maxGameTime + `"
                current="$ctrl.world[1]['gameTime']"
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
                {{$ctrl.world[1]['gameTime']}}'
              </div>
            </div>
            <div class="rightTeamScore">
              {{$ctrl.world[1]['rightScore']}}
              <div class="rightTeamColor"></div>
            </div>
          </div>
          <div class="ball-position">
            <rzslider rz-slider-model="$ctrl.world[2]['goalProximity']" rz-slider-options="$ctrl.sliderOptions"></rzslider>          
          </div>
        </div>
        <div class="timeline">
          <ul scroll-glue>
            <li ng-repeat="event in $ctrl.gameEvents" ng-class="{
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
                <div class="name">{{::event.actorFirstName}}</div>
                <div class="middleDot">&middot;</div>
                <div class="action">{{::event.recordType}}</div>
              </div>
              <div class="eventText">{{::event.recordCommentator}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
};

//background-image directive function
function backgroundImage(){
  return function(scope, element, attrs){
      var url = attrs.backImg;
      element.css({
          'background-image': 'url(' + url +')',
          'background-size' : 'cover',
          'background-position' : 'center center',
          'border-radius' : '50%',
          'opacity' : '0.09'
      });
  };
}

angular.module('shockballGame', ['json-tree', 'luegg.directives', 'angular-svg-round-progressbar', 'rzModule'])
.component('main', mainComponent)
.directive('backImg', backgroundImage)
