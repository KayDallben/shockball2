import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'


import './App.scss'
import './Global.scss'
import shockballBackground from './shockballProto.jpg'
import TopBar from './topbar/topbar.component'
// import Player from './player/player.component'
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
        backgroundOpacity: opacity
    }
    return divStyle
  }
  componentWillMount() {
    this.props.store.handleUserSetup()
  }
  render() {
    return (
      <BrowserRouter>
        <div className="main-wrapper" style={this.setBackgroundImage(shockballBackground, '1')}>
          <div className="content-wrapper">
            <div className="overlay"></div>
            <ErrorBoundary title={'Topbar'}>
              <TopBar store={this.props.store}/>
              <Navigation {...this.props.store.navData} />
            </ErrorBoundary>
            <ErrorBoundary title={'Dashboard'}>
              <Dashboard store={this.props.store}/>
            </ErrorBoundary>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  store: PropTypes.object
}

export default App;
