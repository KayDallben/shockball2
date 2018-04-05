import React from 'react'
import PropTypes from 'prop-types'

import * as ga from '../ga/ga'
import * as utils from '../utils/utils'
import './errorBoundary.scss'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      currentErrorId: null
    }
    this.title = props.title
  }

  componentDidCatch(error, info) {
      this.state.currentErrorId = utils.uuidv4()

      //Display fallback UI
      this.setState({ hasError: true })
      
      ga.gaException(JSON.stringify({
        error: error,
        errorInfo: info,
        shockballErrorId: this.state.currentErrorId
      }), false)
      
      window.Raven.captureException(error, { extra: info, shockballErrorId: this.state.currentErrorId });
  }

  render() {
    if (this.state.hasError) {
        //We render the fallback UI message
        return <div className="error-boundary">
          <div className="shockball-error fa fas-exclamation-triangle fa-2x"></div>
          <p className="sb-error-heading">Aw, dayum!</p>
          <p>Something went wrong, bruh.</p>
          <p>Error id: {this.state.currentErrorId}</p>
        </div>
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  'title': PropTypes.string
}

export default ErrorBoundary
