import React from 'react'
import { Route } from 'react-router-dom'
import moment from 'moment'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { Radar } from 'react-chartjs'
import NumberFormat from 'react-number-format'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './player.scss'

@observer
class Player extends React.Component {
  constructor(props) {
    super(props)
  }

  renderPlayerTeamInfo() {
    if (this.props.view.player.value.teamData.teamName) {
      return (
        <div className="player-info">
          <div className="team-logo"><img src={this.props.view.player.value.teamData.teamPicUrl}/></div>
          <div className="team-name">{this.props.view.player.value.teamData.teamName}</div>
        </div>
      )
    } else {
      return (
        <div className="player-info"></div>
      )
    }
  }

  renderPlayerValueInfo() {
    if (this.props.view.player.value.marketValue) {
      return (
        <div className="player-value">
          <div className="total-value"><NumberFormat value={this.props.view.player.value.marketValue} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
          <div className="label">Value</div>
          <div className="team-wage"><NumberFormat value={this.props.view.player.value.contractData.salary} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
          <div className="label">Wage</div>
          <div className="contract-expiration">{moment(this.props.view.player.value.contractData.contractEndDate).format('L')}</div>
          <div className="label">Contract Expiry</div>
        </div>
      )
    } else {
      return (
        <div className="player-value"></div>
      )
    }
  }

  renderRadar() {
    const data = {
      labels: ["Passing", "Throwing", "Blocking", "Vision", "Toughness", "Endurance"],
      datasets: [
        {
          fillColor: "rgba(255,255,255,0.2)",
          angleLineColor : "#ffffff",
          pointLabelFontColor : "#ffffff",
          strokeColor: "#ffffff",
          pointColor: "#ffffff",
          pointStrokeColor: "#ffffff",
          pointHighlightFill: "#ffffff",
          pointHighlightStroke: "#ffffff",
          data: [this.props.view.player.value.passing, this.props.view.player.value.throwing, this.props.view.player.value.blocking, this.props.view.player.value.vision, this.props.view.player.value.toughness, this.props.view.player.value.endurance]
        }
      ]
    }
    const options = {
      scaleOverride: true,
      scaleSteps: 5,
      scaleStepWidth: 20,
      scaleStartValue: 0
    }
    return (
      <div className="player-radar-graph">
        <Radar data={data} options={options}/>
      </div>
    )
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
              <div>
                <div className="player-name">{this.props.view.player.value.name}</div>
              </div>
              <div className="player-info-row">
                <div className="player-photo">
                  <img src={this.props.view.player.value.image}/>
                </div>
                {this.renderPlayerTeamInfo()}
                {this.renderPlayerValueInfo()}
                {this.renderRadar()}
              </div>
              <div className="player-body">
                <div className="stats">
                  <h2>Skills</h2>
                  <div className="skill">Passing: {this.props.view.player.value.passing}</div>
                  <div className="skill">Throwing: {this.props.view.player.value.throwing}</div>
                  <div className="skill">Blocking: {this.props.view.player.value.blocking}</div>
                  <div className="skill">Vision: {this.props.view.player.value.vision}</div>
                  <div className="skill">Toughness: {this.props.view.player.value.toughness}</div>
                  <div className="skill">Endurance: {this.props.view.player.value.endurance}</div>
                  <h2>Modifiers</h2>
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