import React from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
    this.title = props.title
  }

  componentDidCatch(error, info) {
      //Display fallback UI
      this.setState({ hasError: true })
      // we should log these errors to splunk here, but no need to put into console because they will be there anyway
  }

  render() {
    if (this.state.hasError) {
        //We render the fallback UI message
        return <div className="error-boundary">Ooops! Something went wrong.</div>
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  'title': PropTypes.string
}

export default ErrorBoundary