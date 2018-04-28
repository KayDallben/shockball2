import React from 'react'
import { Route } from 'react-router-dom'

import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Line, Circle } from 'rc-progress'
import Spinner from 'react-spinkit'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './fixture.scss'


@observer
class Fixture extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameEvents: [],
      homeScore: 0,
      awayScore: 0,
      gameTime: 0
    }
    this.tempEventsHolder = []
    this.gameStarted = false
    this.matchInterval = null
  }

  getIdFromRoute() {
      return window.location.href.split('/').pop()
  }

  allEvents() {
    let events = this.state.gameEvents.map((event) => {
      return (
        <div className="event">
            <div>{event.recordGameTime} - {event.actorName} - {event.recordType}</div>
        </div>
      )
    })
    return events
  }

  incrementIfHomeGoal(event) {
    if (event.recordType === 'goal' && event.recordPitchSide === 'left') {
      const newScore = this.state.homeScore + 1
      return newScore
    } else {
      return this.state.homeScore
    }
  }

  incrementIfAwayGoal(event) {
    if (event.recordType === 'goal' && event.recordPitchSide === 'right') {
      const newScore = this.state.awayScore + 1
      return newScore
    } else {
      return this.state.awayScore
    }
  }

  startMatchEvents() {
    this.matchInterval = setInterval(() => {
      const nextGameEvent = this.tempEventsHolder.shift()
      if (typeof(nextGameEvent) !== 'undefined') {
        const newState = this.state.gameEvents
        newState.push(nextGameEvent)
        this.setState({
          gameEvents: newState,
          homeScore: this.incrementIfHomeGoal(nextGameEvent),
          awayScore: this.incrementIfAwayGoal(nextGameEvent),
          gameTime: nextGameEvent.recordGameTime
        })
      } else {
        this.stopMatchEvents()
      }
    }, 2000)
  }

  stopMatchEvents() {
    window.clearInterval(this.matchInterval)
  }

  render() {
    switch (this.props.view.fixture.state) {
      case "pending":
        return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
        throw this.props.view.fixture.reason
      case "fulfilled":
        if (!this.gameStarted) {
          this.gameStarted = true;
          this.startMatchEvents()
          this.tempEventsHolder = this.props.view.fixture.value.events
        }
        return (
          <div className="fixture-wrapper">
            <div className="play-by-play">
              <div className="head-section">
                <div className="element-title">PLAY-BY-PLAY</div>
                <div className="left-side">
                  <div className="team-logo">
                    <img src={this.props.view.fixture.value.fixtureInfo.homeTeamLogo}/>
                  </div>
                  <div className="team-name">{this.props.view.fixture.value.fixtureInfo.homeTeamName}</div>
                </div>
                <div className="center">
                  <div className="inner-wrap">
                    <div className="left-score">{this.state.homeScore}</div>
                    <div className="game-time">{this.state.gameTime}'</div>
                    <div className="right-score">{this.state.awayScore}</div>
                  </div>
                </div>
                <div className="right-side">
                  <div className="team-logo">
                    <img src={this.props.view.fixture.value.fixtureInfo.awayTeamLogo}/>
                  </div>
                  <div className="team-name">{this.props.view.fixture.value.fixtureInfo.awayTeamName}</div>
                </div>
              </div>
              <div className="event-holder">
                {this.allEvents()}
              </div>
            </div>
          </div>
        )
    }
  }
}

Fixture.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default Fixture