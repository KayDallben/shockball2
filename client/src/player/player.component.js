import React from 'react'
import { Route } from 'react-router-dom'
import moment from 'moment'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import ReactDataGrid from 'react-data-grid'
import { Radar } from 'react-chartjs'
import Select2 from 'react-select'
import 'react-select/dist/react-select.css'
import { Form, Text, TextArea, Radio, RadioGroup, Select, Checkbox } from 'react-form'

import NumberFormat from 'react-number-format'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './player.scss'

@observer
class Player extends React.Component {
  constructor(props) {
    super(props)
    this._recordColumns = [
      {
        key: 'season',
        name: 'Season',
        width: 100
      },
      {
        key: 'matches',
        name: 'Matches Played',
        width: 150
      },
      {
        key: 'goals',
        name: 'Goals',
        width: 100
      },
      {
        key: 'shots',
        name: 'Shots',
        width: 100        
      },
      {
        key: 'blocksShot',
        name: 'Goals Blocked',
        width: 150
      },
      {
        key: 'passes',
        name: 'Passes',
        width: 100
      },
      {
        key: 'blocksPass',
        name: 'Passes Blocked',
        width: 150
      },
      {
        key: 'runsBall',
        name: 'Runs',
        width: 100
      },
      {
        key: 'tackles',
        name: 'Tackles',
        width: 100
      },
      {
        key: 'goalAverage',
        name: 'Goal Average',
        width: 150
      }
    ],
    this.statusOptions = [
      {
        label: 'Single',
        value: 'single',
      },
      {
        label: 'In a Relationship',
        value: 'relationship',
      },
      {
        label: "It's Complicated",
        value: 'complicated',
      },
    ]
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
        <div className="player-info">
          <div className="team-logo free-agent fa fa-user-secret fa-2x"></div>
          <div className="team-name">Free Agent</div>
        </div>
      )
    }
  }

  offerContract() {
    this.props.store.showModal(
      <div className="contract-wrapper">
        <div className="modal-title">Offer Contract</div>
        <div className="player-value">
            <h3>Player:</h3>
            <div className="player-photo">
              <img src={this.props.view.player.value.image}/>
            </div>
            <div className="total-value">
              <div>Market Value:</div>
              <NumberFormat value={this.props.view.player.value.marketValue} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
        </div>
        <div className="contract-offer">
          <h3>Contract Bid:</h3>
          <Form onSubmit={submittedValues => console.log(submittedValues)}>
            {formApi => (
              <form onSubmit={formApi.submitForm} id="contract">
                <label htmlFor="firstName">First name</label>
                <Text field="firstName" id="firstName" />
                <label htmlFor="lastName">Last name</label>
                <Text field="lastName" id="lastName" />
                <RadioGroup field="gender">
                  <label htmlFor="male" className="mr-2">Male</label>
                  <Radio value="male" id="male" className="mr-3 d-inline-block" />
                  <label htmlFor="female" className="mr-2">Female</label>
                  <Radio value="female" id="female" className="d-inline-block" />
                </RadioGroup>
                <label htmlFor="bio">Bio</label>
                <TextArea field="bio" id="bio" />
                <label htmlFor="authorize" className="mr-2">Authorize</label>
                <Checkbox field="authorize" id="authorize" className="d-inline-block" />
                <label htmlFor="status" className="d-block">Relationship status</label>
                <Select field="status" id="status" options={this.statusOptions} className="mb-4" />
                <button type="submit" className="mb-4 btn btn-primary">
                  Submit
                </button>
              </form>
            )}
          </Form>
        </div>
      </div>
    )
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
      if (!this.props.view.player.value.teamUid && this.props.store.currentUser.teamManager) {
        return (
          <div className="player-value">
            <div className="contract-offer" onClick={this.offerContract.bind(this)}>Offer Contract</div>
          </div>
        )
      } else {
        return (
          <div className="player-value"></div>
        )
      }
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

  rowGetter = (i) => {
    return this.props.view.player.value.records[i];
  }

  renderTrainingInput() {
    if (this.props.view.player.value.createdAsUid === this.props.store.currentUser.createdAsUid) {
      return (
        <div className="train">
          <h2>Training Regimen</h2>
          <Select2 name="train-field"
            value={this.props.store.currentUser.regimen}
            onChange={this.handleTrainChange.bind(this)}
            options={[
              {
                value: 'Wing',
                label: 'Wing'
              },
              {
                value: 'Center',
                label: 'Center'
              },
              {
                value: 'Guard',
                label: 'Guard'
              },
              {
                value: 'Rest',
                label: 'Rest'
              }
            ]}
          />
        </div>
      )
    } else {
      return (
        <div className="train"></div>
      )
    }
  }

  handleTrainChange(selectedOption) {
    this.props.store.setTrainingRegimen(selectedOption)
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
              <div className="player-name-holder">
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
                  <div className="skills">
                    <h2>Skills</h2>
                    <div className="skill">Passing: {this.props.view.player.value.passing}</div>
                    <div className="skill">Throwing: {this.props.view.player.value.throwing}</div>
                    <div className="skill">Blocking: {this.props.view.player.value.blocking}</div>
                    <div className="skill">Vision: {this.props.view.player.value.vision}</div>
                    <div className="skill">Toughness: {this.props.view.player.value.toughness}</div>
                    <div className="skill">Endurance: {this.props.view.player.value.endurance}</div>
                  </div>
                  {this.renderTrainingInput()}
                  <div className="modifiers">
                    <h2>Modifiers</h2>
                    <div className="modifier">Leadership: {this.props.view.player.value.leadership}</div>
                    <div className="modifier">Morale: {this.props.view.player.value.morale}</div>
                    <div className="modifier">Fatigue: {this.props.view.player.value.fatigue}</div>
                    <div className="modifier">Aggression: {this.props.view.player.value.aggression}</div> 
                  </div>
                </div>
              </div>
              <div className="player-records">
                <ReactDataGrid
                columns={this._recordColumns}
                rowGetter={this.rowGetter}
                rowsCount={this.props.view.player.value.records.length}
                minHeight={500} />
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