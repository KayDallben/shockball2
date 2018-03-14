import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'


import Player from '../player/player.component'
import Squad from '../squad/squad.component'
import League from '../league/league.component'
import Fixture from '../fixture/fixture.component'
import ErrorBoundary from '../errorBoundary/errorBoundary.component'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ErrorBoundary title={'Dashboard'}>
        <Switch>
          <Route exact path='/' render={
              () => <Player store={this.props.store} /> 
            }
          />
          <Route exact path='/squad' render={
              () => <Squad store={this.props.store} /> 
            }
          />
          <Route exact path='/league' render={
              () => <League store={this.props.store} /> 
            }
          />
          <Route path="/fixture/:fixtureId" render={
              () => <Fixture store={this.props.store} />
            }
          />
        </Switch>
      </ErrorBoundary>
    )
  }
}

Dashboard.propTypes = {
  'store': PropTypes.object
}

export default Dashboard