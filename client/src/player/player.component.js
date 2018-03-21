import React from 'react'
import { Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './player.scss'

@observer
class Player extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    switch (this.props.view.player.state) {
      case "pending":
          return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
          throw this.props.view.player.reason
      case "fulfilled":
        return (
          <div className="player">
            <div className="player-wrapper">
              <div className="sidebar">
                <div className="player-photo">
                  {/* <img src={this.props.store.currentUser.image}/> */}
                  <img src={this.props.view.player.value.image}/>
                </div>
                {/* <div className="player-name">{this.props.store.currentUser.name}</div> */}
                <div className="player-name">{this.props.view.player.value.name}</div>
              </div>
              <div className="player-body">
                <div className="stats">
                  <h2>Skills</h2>
                  {/* <div className="skill">Passing: {this.props.store.currentUser.passing}</div>
                  <div className="skill">Throwing: {this.props.store.currentUser.throwing}</div>
                  <div className="skill">Blocking: {this.props.store.currentUser.blocking}</div>
                  <div className="skill">Vision: {this.props.store.currentUser.vision}</div>
                  <div className="skill">Toughness: {this.props.store.currentUser.toughness}</div>
                  <div className="skill">Endurance: {this.props.store.currentUser.endurance}</div> */}
                  <div className="skill">Passing: {this.props.view.player.value.passing}</div>
                  <div className="skill">Throwing: {this.props.view.player.value.throwing}</div>
                  <div className="skill">Blocking: {this.props.view.player.value.blocking}</div>
                  <div className="skill">Vision: {this.props.view.player.value.vision}</div>
                  <div className="skill">Toughness: {this.props.view.player.value.toughness}</div>
                  <div className="skill">Endurance: {this.props.view.player.value.endurance}</div>
                  <h2>Modifiers</h2>
                  {/* <div className="modifier">Leadership: {this.props.store.currentUser.leadership}</div>
                  <div className="modifier">Morale: {this.props.store.currentUser.morale}</div>
                  <div className="modifier">Fatigue: {this.props.store.currentUser.fatigue}</div>
                  <div className="modifier">Aggression: {this.props.store.currentUser.aggression}</div> */}
                  <div className="modifier">Leadership: {this.props.view.player.value.leadership}</div>
                  <div className="modifier">Morale: {this.props.view.player.value.morale}</div>
                  <div className="modifier">Fatigue: {this.props.view.player.value.fatigue}</div>
                  <div className="modifier">Aggression: {this.props.view.player.value.aggression}</div>
                    
                </div>
              </div>
            </div>
          </div>
        )
    }
  }
}

Player.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default Player