import React from 'react'

import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './league.scss'


@observer
class League extends React.Component {
  constructor(props) {
    super(props)
  }

  calculateScore(fixture) {
      if (fixture.status === 'complete') {
          return (<div>
            <div>{fixture.homeTeamScore} - {fixture.awayTeamScore}</div>
            <div onClick={() => this.props.store.showFixturePage(fixture.fixtureId)} className="fa fa-arrow-right"></div>
          </div>)
      } else {
          return (<div></div>)
      }
  }

  allFixtures() {
      const fixtures = this.props.view.fixtures.value.map((fixture) => {
          return (
            <div className="row">
                <div>{fixture.gameDate}</div>
                <div><img src={fixture.homeTeamLogo}/>{fixture.homeTeamName}</div>
                <div><img src={fixture.awayTeamLogo}/>{fixture.awayTeamName}</div>
                {this.calculateScore(fixture)}
            </div>
          )
      })
      return fixtures
  }

  render() {
    switch (this.props.view.fixtures.state) {
      case "pending":
          return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
          throw this.props.view.fixtures.reason
      case "fulfilled":
          return (
            <div className="league-wrapper">
              <div className="fixture-set">
                <div className="header">
                  <div>Date</div>
                  <div>Home</div>
                  <div>Away</div>
                  <div>Result</div>
                </div>
                {this.allFixtures()}
              </div>
            </div>
          )
    }
  }
}

League.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default League