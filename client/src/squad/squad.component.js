import React from 'react'
import { Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './squad.scss'

@observer
class Squad extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="squad-wrapper">
        squad view
      </div>
    )
  }
}

Squad.propTypes = {
  store: PropTypes.object
}

export default Squad