import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import ReactDataGrid from 'react-data-grid'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './squad.scss'

@observer
class Squad extends React.Component {
  constructor(props) {
    super(props)
    this._columns = [
      {
          key: 'name',
          name: 'Name',
          width: 180,
          locked: true,
          formatter: this.createPlayerLink,
          getRowMetaData: (data)=>(data)
      },
      {
        key: 'rating',
        name: 'Rating',
        width: 100,
        sortable: true
      },
      {
        key: 'throwing',
        name: 'Throwing',
        width: 100,
        sortable: true
      },
      {
        key: 'passing',
        name: 'Passing',
        width: 100,
        sortable: true
      },
      {
        key: 'blocking',
        name: 'Blocking',
        width: 100,
        sortable: true
      },
      {
        key: 'endurance',
        name: 'Endurance',
        width: 100,
        sortable: true
      },
      {
        key: 'vision',
        name: 'Vision',
        width: 100,
        sortable: true
      },
      {
        key: 'toughness',
        name: 'Toughness',
        width: 100,
        sortable: true
      },
      {
        key: 'leadership',
        name: 'Leadership',
        width: 100,
        sortable: true
      },
      {
        key: 'fatigue',
        name: 'Fatigue',
        width: 100,
        sortable: true
      },
      {
        key: 'morale',
        name: 'Morale',
        sortable: true
      }
    ]
  }

  getTeamManager() {
    let teamManager = {}
    for (var i=0;i < this.props.view.squad.value.teamPlayers.length;i++) {
      if (this.props.view.squad.value.teamPlayers[i].teamManager === this.props.view.squad.value.teamInfo.teamUid) {
        teamManager = this.props.view.squad.value.teamPlayers[i]
        break
      }
    }
    return teamManager
  }

  createPlayerLink = (row) => {
    return (
      <a onClick={() => this.props.store.showPlayerPage(row.dependentValues.shockballPlayerUid)}>{row.dependentValues.name}</a>
    )
  }

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    }

    const rows = sortDirection === 'NONE' ? this.props.view.squad.value.teamPlayers.slice(0) : this.props.view.squad.value.teamPlayers.sort(comparer);
  }

  rowGetter = (i) => {
    return this.props.view.squad.value.teamPlayers[i];
  }

  calculateSeasonForAgainst() {
    let wins = 0
    let losses = 0
    let draws = 0
    if (this.props.view.squad.value.teamFixtures.length > 0) {
      this.props.view.squad.value.teamFixtures.map(fixture => {
        if (fixture.status === 'complete') {
          if (fixture.homeTeam === this.props.view.squad.value.teamInfo.teamUid) {
            if (fixture.homeTeamScore > fixture.awayTeamScore) {
              wins++
            } else if (fixture.homeTeamScore === fixture.awayTeamScore) {
              draws++
            } else {
              losses++
            }
          } else {
            if (fixture.homeTeamScore > fixture.awayTeamScore) {
              losses++
            } else if (fixture.homeTeamScore === fixture.awayTeamScore) {
              draws++
            } else {
              wins++
            }
          }
        }
      })
      return `${wins} - ${losses} - ${draws}`
    } else {
      return '0 - 0 - 0'
    }
  }

  renderStartingPlayer(position) {
    let playerDiv = {
      name: 'BOT',
      image: 'https://0x0800.github.io/2048-STARWARS/style/img/512.svg'
    }
    for (var i = 0; i < this.props.view.squad.value.teamPlayers.length; i++) {
      if (this.props.view.squad.value.teamPlayers[i].lineupPosition === position) {
        playerDiv = {
          name: this.props.view.squad.value.teamPlayers[i].name,
          image: this.props.view.squad.value.teamPlayers[i].image
        }
        break
      }
    }
    return (
      <div className="player-circle">
        <div className="player-name-label">{playerDiv.name}</div>
        <img className="player-image" src={playerDiv.image}/>
      </div>
    )
  }

  renderLineup() {
    return (
      <div className="lineup-wrapper">
        <h4 className="team-players-title">Match Lineup</h4>
        <div className="arena">
          <div className="leftWing">{this.renderStartingPlayer('left')}</div>
          <div className="center">{this.renderStartingPlayer('center')}</div>
          <div className="rightWing">{this.renderStartingPlayer('right')}</div>
          <div className="guard">{this.renderStartingPlayer('guard')}</div>
          <div className="sub1">{this.renderStartingPlayer('sub1')}</div>
          <div className="sub2">{this.renderStartingPlayer('sub2')}</div>
        </div>
      </div>
    )
  }

  renderPlayers() {
    return (
      <div className="team-players-wrapper">
        <h4 className="team-players-title">Team Players</h4>
        <ReactDataGrid
          onGridSort={this.handleGridSort}
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.props.view.squad.value.teamPlayers.length}
          minHeight={200} />
      </div>
    )
  }

  renderTeamInfo() {
    if (this.props.view.squad.value.teamInfo.teamUid) {
      return (
        <div className="inner-squad-wrapper">
          <div className="squad-header-row">
            <div className="squad-profile">
              <div className="squad-name">
                {this.props.view.squad.value.teamInfo.teamName}
              </div>
              <div className="squad-logo">
                <img src={this.props.view.squad.value.teamInfo.teamPicUrl}/> 
              </div>
            </div>
            <div className="squad-record">
              <div className="label">Record:</div>
              <div className="record-value">{this.calculateSeasonForAgainst()}</div>
            </div>
            <div className="squad-venue">
              <div className="label">Venue:</div>
              <div className="venue-name">{this.props.view.squad.value.teamInfo.teamVenue}</div>
            </div>
            <div className="squad-manager">
              <div className="label">Team Manager:</div>
              <div className="manager-name">{this.getTeamManager().name}</div>
              <img className="manager-image" src={this.getTeamManager().image}/>
            </div>
          </div>
          {this.renderPlayers()}
          {this.renderLineup()}
        </div>
      )
    } else {
      return (
        <div className="no-team">You are a free agent and have no team yet. Teams can offer you contracts. Train up your skills and git gud!</div>
      )
    }
  }

  render() {
    switch (this.props.view.squad.state) {
      case "pending":
          return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
          throw this.props.view.squad.reason
      case "fulfilled":
        console.log(this.props.view.squad.value)
        return (
          <div className="squad-wrapper">
            {this.renderTeamInfo()}
          </div>
        )
    }
  }
}

Squad.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default Squad