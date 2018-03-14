import React from 'react'
import { Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './player.scss'

@observer
class Player extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="player">
        <div className="player-wrapper">
          <div className="sidebar">
            <div className="player-photo">
              <img src={this.props.store.currentUser.image}/>
            </div>
            <div className="player-name">{this.props.store.currentUser.name}</div>
          </div>
          <div className="player-body">
            <div className="stats">
              <h2>Skills</h2>
              <div className="skill">Passing: {this.props.store.currentUser.passing}</div>
              <div className="skill">Throwing: {this.props.store.currentUser.throwing}</div>
              <div className="skill">Blocking: {this.props.store.currentUser.blocking}</div>
              <div className="skill">Vision: {this.props.store.currentUser.vision}</div>
              <div className="skill">Toughness: {this.props.store.currentUser.toughness}</div>
              <div className="skill">Endurance: {this.props.store.currentUser.endurance}</div>
              <h2>Modifiers</h2>
              <div className="modifier">Leadership: {this.props.store.currentUser.leadership}</div>
              <div className="modifier">Morale: {this.props.store.currentUser.morale}</div>
              <div className="modifier">Fatigue: {this.props.store.currentUser.fatigue}</div>
              <div className="modifier">Aggression: {this.props.store.currentUser.aggression}</div>
                
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Player.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default Player