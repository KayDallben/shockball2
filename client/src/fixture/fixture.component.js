import React from 'react'
import { Route } from 'react-router-dom'

import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Line, Circle } from 'rc-progress'

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
          return <h1>Loading fixture.. { this.props.view.fixtureId }</h1>
      case "rejected":
          throw this.props.view.fixture.reason
      case "fulfilled":
          return (
            <div className="fixture-wrapper">
              {this.allEvents()}
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