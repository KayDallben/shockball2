import React from 'react'
import { Route } from 'react-router-dom'

import Card from '../card/card.component'
import ErrorBoundary from '../errorBoundary/errorBoundary.component'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="dashboard-wrapper">
        <div>This is the dashboard component</div>
        <ErrorBoundary title={'Card'}>
          <Route path="/"
            render={
              () => <Card name={'testName'} id={4} {...{properties: [{'test': 'what'}]}} />
            }
          />
        </ErrorBoundary>
      </div>
    )
  }
}

export default Dashboard