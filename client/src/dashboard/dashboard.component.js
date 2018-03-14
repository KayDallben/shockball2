import React from 'react'
// import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'


import Player from '../player/player.component'
import Squad from '../squad/squad.component'
import League from '../league/league.component'
import Fixture from '../fixture/fixture.component'
import ErrorBoundary from '../errorBoundary/errorBoundary.component'

@observer
class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  renderCurrentView(store) {
    const view = store.currentView;
    switch (view.name) {
        case "player":
            return <Player view={view} store={store} />
        // case "squad":
        //     return <Squad view={view} store={store} />
        case "league":
            return <League view={view} store={store} />
        case "fixture":
            return <Fixture view={view} store={store} />
        default: 
          return <Player view={view} store={store} />
    }
  }

  render() {
    return (
      <ErrorBoundary title={'Dashboard'}>
        {/* <Switch>
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
        </Switch> */}
        { this.renderCurrentView(this.props.store) }
      </ErrorBoundary>
    )
  }
}

Dashboard.propTypes = {
  store: PropTypes.object
}

export default Dashboard