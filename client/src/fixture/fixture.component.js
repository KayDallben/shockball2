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

  componentWillMount() {
    this.props.store.getSingleFixture(this.getIdFromRoute())
  }

  getIdFromRoute() {
      return window.location.href.split('/').pop()
  }

  allEvents() {
    let events = this.props.store.currentFixture.events.map((event) => {
        return (
          <div className="event">
              <div>{event.recordGameTime} - {event.actorName} - {event.recordType}</div>
          </div>
        )
    })
    return events
  }

  render() {
    return (
      <div className="fixture-wrapper">
        {this.allEvents()}
      </div>
    )
  }
}

Fixture.propTypes = {
  store: PropTypes.object
}

export default Fixture