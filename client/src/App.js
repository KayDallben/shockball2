import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'

import './App.scss'
import './Global.scss'
import shockballBackground from './shockballProto.jpg'
import TopBar from './topbar/topbar.component'
import Player from './player/player.component'
import Navigation from './navigation/navigation.component'
import Dashboard from './dashboard/dashboard.component'
import ErrorBoundary from './errorBoundary/errorBoundary.component'

const navData = {
  navLinks: [
    {
      title: 'Me',
      icon: 'fa fa-user'
    },
    {
      title: 'Squad',
      icon: 'fa fa-users'
    },
    {
      title: 'Office',
      icon: 'fa fa-briefcase'
    },
    {
      title: 'League',
      icon: 'fa fa-flag'
    },
    {
      title: 'Transfers',
      icon: 'fa fa-building'
    }
  ]
}

class App extends Component {
  setBackgroundImage(url, opacity) {
    const divStyle = {
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        borderRadius: '0px',
        backgroundImage: "url(" + url + ")",
        backgroundOpacity: opacity
    }
    return divStyle
  }
  render() {
    return (
      
      <BrowserRouter>
        <div className="main-wrapper" style={this.setBackgroundImage(shockballBackground, '1')}>
          <div className="content-wrapper">
            <div className="overlay"></div>
            <ErrorBoundary title={'Topbar'}>
              <TopBar />
              <Navigation {...navData} />
            </ErrorBoundary>
            <ErrorBoundary title={'Dashboard'}>
              <Player />
            </ErrorBoundary>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
