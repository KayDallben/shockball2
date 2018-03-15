import React from 'react'
// import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'


import Player from '../player/player.component'
import Squad from '../squad/squad.component'
import League from '../league/league.component'
import Transfers from '../transfers/transfers.component'
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
        case "squad":
          return <Squad view={view} store={store} />
        case "league":
          return <League view={view} store={store} />
        case "fixture":
          return <Fixture view={view} store={store} />
        case "office":
          return <div>office goes here</div>
        case "transfers":
          return <Transfers view={view} store={store} />
        default: 
          return <Player view={view} store={store} />
    }
  }

  render() {
    return (
      <ErrorBoundary title={'Dashboard'}>
        { this.renderCurrentView(this.props.store) }
      </ErrorBoundary>
    )
  }
}

Dashboard.propTypes = {
  store: PropTypes.object
}

export default Dashboard