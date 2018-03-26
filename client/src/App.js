import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'


import './App.scss'
import './Global.scss'
import shockballBackground from './shockballProto.jpg'
import TopBar from './topbar/topbar.component'
import Navigation from './navigation/navigation.component'
import Dashboard from './dashboard/dashboard.component'
import ErrorBoundary from './errorBoundary/errorBoundary.component'

@observer
class App extends Component {
  setBackgroundImage(url, opacity) {
    const divStyle = {
        backgroundSize: 'cover',
        backgroundPosition: 'no-repeat center center fixed',
        borderRadius: '0px',
        backgroundImage: "url(" + url + ")",
        backgroundOpacity: opacity,
        backgroundAttachment: 'fixed'
    }
    return divStyle
  }
  componentWillMount() {
    this.props.store.handleUserSetup()
  }

  render() {
    return (
      <div className="main-wrapper" style={this.setBackgroundImage(shockballBackground, '1')}>
        <div className="content-wrapper">
          <ErrorBoundary title={'Topbar'}>
            <TopBar store={this.props.store}/>
            <Navigation store={this.props.store} />
          </ErrorBoundary>
          <ErrorBoundary title={'Dashboard'}>
            <Dashboard store={this.props.store}/>
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  store: PropTypes.object
}

export default App;
