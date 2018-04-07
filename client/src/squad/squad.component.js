import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './squad.scss'

@observer
class Squad extends React.Component {
  constructor(props) {
    super(props)
  }

  renderTeamInfo() {

  }

  render() {
    switch (this.props.view.squad.state) {
      case "pending":
          return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
          throw this.props.view.squad.reason
      case "fulfilled":
        console.log(this.props.view.squad.value)
        return (
          <div className="squad-wrapper">
            {this.renderTeamInfo()}
          </div>
        )
    }
  }
}

Squad.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default Squad