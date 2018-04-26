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
  }

  getIdFromRoute() {
      return window.location.href.split('/').pop()
  }

  allEvents() {
    console.log(this.props.view.fixture.value)
    let events = this.props.view.fixture.value.events.map((event) => {
        return (
          <div className="event">
              <div>{event.recordGameTime} - {event.actorName} - {event.recordType}</div>
          </div>
        )
    })
    return events
  }

  render() {
    switch (this.props.view.fixture.state) {
      case "pending":
          return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
          throw this.props.view.fixture.reason
      case "fulfilled":
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
                      <div className="left-score">{this.props.view.fixture.value.fixtureInfo.homeTeamScore}</div>
                      <div className="game-time">46'</div>
                      <div className="right-score">{this.props.view.fixture.value.fixtureInfo.awayTeamScore}</div>
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