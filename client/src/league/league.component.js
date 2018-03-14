import React from 'react'
import { Route, Link } from 'react-router-dom'

import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './league.scss'


@observer
class League extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.store.handleFixtureData()
  }

  calculateScore(fixture) {
      if (fixture.status === 'complete') {
          return (<div>
            <div>{fixture.homeTeamScore} - {fixture.awayTeamScore}</div>
            <Link to={`/fixture/${fixture.fixtureId}`}><div className="fa fa-arrow-right"></div></Link>
          </div>)
      } else {
          return (<div></div>)
      }
  }

  allFixtures() {
      const fixtures = this.props.store.fixtures.map((fixture) => {
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

League.propTypes = {
  store: PropTypes.object
}

export default League