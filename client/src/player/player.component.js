import React from 'react'
import { Route } from 'react-router-dom'
import axios from 'axios'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './player.scss'


class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      player: {
        image: '',
        name: ''
      }
    }
  }

  componentDidMount() {
    // axios.get(`http://www.reddit.com/r/${this.props.subreddit}.json`)
    //   .then(res => {
    //     const posts = res.data.data.children.map(obj => obj.data);
    //     this.setState({ posts });
    //   });
  }

  render() {
    return (
      <div className="player">
        <div className="player-wrapper">
          <div className="sidebar">
            <div className="player-photo">
              <img src={this.state.player.image}/>
            </div>
            <div className="player-name">{this.state.player.name}</div>
          </div>
          <div className="player-body">
            <div className="stats">
              <h2>Skills</h2>
              <div className="skill">Passing: {this.state.player.passing}</div>
              <div className="skill">Throwing: {this.state.player.throwing}</div>
              <div className="skill">Blocking: {this.state.player.blocking}</div>
              <div className="skill">Vision: {this.state.player.vision}</div>
              <div className="skill">Toughness: {this.state.player.toughness}</div>
              <div className="skill">Endurance: {this.state.player.endurance}</div>
              <h2>Modifiers</h2>
              <div className="modifier">Leadership: {this.state.player.leadership}</div>
              <div className="modifier">Morale: {this.state.player.morale}</div>
              <div className="modifier">Fatigue: {this.state.player.fatigue}</div>
              <div className="modifier">Aggression: {this.state.player.aggression}</div>
                
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Player