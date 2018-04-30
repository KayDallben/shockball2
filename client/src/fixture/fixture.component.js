import React from 'react'
import { Route } from 'react-router-dom'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

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
    this.stats = {
      homePasses: 0,
      awayPasses: 0,
      homeTackles: 0,
      awayTackles: 0,
      homePossession: 0,
      awayPossession: 0,
      homeScorers: [],
      awayScorers: []
    }
    this.gameStarted = false
    this.matchInterval = null
  }

  getIdFromRoute() {
      return window.location.href.split('/').pop()
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

  setIconClass(event) {
    let className = 'generic'
    switch(event.recordType) {
      case 'goal':
        //
        className = 'goal'
        break;
      case 'goal blocked':
        //
        className = 'goal-blocked'
        break;
      case 'shoots':
        //
        className = 'shoots'
        break;
      case 'passes ball':
        //
        className = 'passes-ball'
        break;
      case 'pass blocked':
        //
        className = 'pass-blocked'
        break;
      case 'tackles ball':
        //
        className = 'tackles-ball'
        break;
      case 'tackles':
        //
        className = 'tackles'
        break;
      case 'runs ball':
        //
        className = 'runs-ball'
        break;
      case 'player rotation':
        //
        className = 'player-rotation'
        break;
      default:
        //
    }
    return className
  }

  calculateStats() {
    const totalEventsCount = this.props.view.fixture.value.events.length
    let homeEventsCount = 0
    let awayEventsCount = 0
    for (let event of this.props.view.fixture.value.events) {
      if (event.recordPitchSide === 'left') {
        //homeTeam
        homeEventsCount++
        if (event.recordType === 'passes ball') {
          this.stats.homePasses++
        }
        if (event.recordType === 'tackles') {
          this.stats.homeTackles++
        }
        if (event.recordType === 'goal') {
          this.stats.homeScorers.push(event)
        }
      } else {
        //awayTeam
        awayEventsCount++
        if (event.recordType === 'passes ball') {
          this.stats.awayPasses++
        }
        if (event.recordType === 'tackles') {
          this.stats.awayTackles++
        }
        if (event.recordType === 'goal') {
          this.stats.awayScorers.push(event)
        }
      }
    }
    this.stats.homePossession = Math.round((homeEventsCount / totalEventsCount) * 100)
    this.stats.awayPossession = 100 - this.stats.homePossession
  }

  renderScorers(side) {
    if (side === 'home') {
      let homeScorers = null
      if (this.stats.homeScorers.length > 0) {
        homeScorers = this.stats.homeScorers.map((event) => {
          return (
            <div className="scorer">{event.actorName} - {event.recordGameTime + '\''}</div>
          )
        })
      }
      return homeScorers
    } else {
      let awayScorers = null
      if (this.stats.awayScorers.length > 0) {
        awayScorers = this.stats.awayScorers.map((event) => {
          return (
            <div className="scorer">{event.actorName} - {event.recordGameTime + '\''}</div>
          )
        })
      }
      return awayScorers
    }
  }

  allEvents() {
    let events = this.state.gameEvents.map((event) => {
      return (
        <VerticalTimelineElement
          className={this.setIconClass(event)}
          iconStyle={{ background: 'rgba(255,255,255)', color: '#000000'}}
          date={event.recordGameTime + '\''}
          position={event.recordPitchSide === 'left' ? 'left': 'right'}
        >
          <img src={event.actorPicUrl} />
          <h4 className="vertical-timeline-element-title">{event.actorName}</h4>
          <p>
            {event.recordCommentator}
          </p>
        </VerticalTimelineElement>
      )
    })
    events.reverse()
    return events
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
          this.calculateStats()
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
                <VerticalTimeline animate={false}>
                  {this.allEvents()}
                </VerticalTimeline>
              </div>
            </div>
            <div className="match-results">
              <div className="result-row info-row">
                <div className="left-team">
                  <div className="left-team-logo">
                    <img src={this.props.view.fixture.value.fixtureInfo.homeTeamLogo}/>
                  </div>
                  <div className="left-team-name">{this.props.view.fixture.value.fixtureInfo.homeTeamName}</div>
                </div>
                <div className="label">Match Results</div>
                <div className="right-team">
                  <div className="right-team-logo">
                    <img src={this.props.view.fixture.value.fixtureInfo.awayTeamLogo}/>
                  </div>
                  <div className="away-team-name">{this.props.view.fixture.value.fixtureInfo.awayTeamName}</div>
                </div>
              </div>
              <div className="result-row">
                <div className="left-stat">{this.props.view.fixture.value.fixtureInfo.homeTeamScore}</div>
                <div className="stat-label">Goals</div>
                <div className="right-stat">{this.props.view.fixture.value.fixtureInfo.awayTeamScore}</div>
              </div>
              <div className="result-row">
                <div className="left-stat">{this.stats.homePasses}</div>
                <div className="stat-label">Passes</div>
                <div className="right-stat">{this.stats.awayPasses}</div>
              </div>
              <div className="result-row">
                <div className="left-stat">{this.stats.homeTackles}</div>
                <div className="stat-label">Tackles</div>
                <div className="right-stat">{this.stats.awayTackles}</div>
              </div>
              <div className="result-row">
                <div className="left-stat">{this.stats.homePossession + '%'}</div>
                <div className="stat-label">Possession</div>
                <div className="right-stat">{this.stats.awayPossession + '%'}</div>
              </div>
              <div className="result-row scorers-row">
                <div className="left-stat">{this.renderScorers('home')}</div>
                <div className="stat-label">Scoring</div>
                <div className="right-stat">{this.renderScorers('away')}</div>
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