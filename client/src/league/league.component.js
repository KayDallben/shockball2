import React from 'react'

import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import ReactDataGrid from 'react-data-grid'
import Spinner from 'react-spinkit'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './league.scss'


@observer
class League extends React.Component {
  constructor(props) {
    super(props)
    this.standings = []
    this._columns = [
      {
        key: 'teamName',
        name: 'Team',
        formatter: this.createTeamLinkUrl,
        getRowMetaData: (data)=>(data),
        sortable: true
      },
      {
        key: 'played',
        name: 'Played',
        width: 100,
        sortable: true
      },
      {
        key: 'wins',
        name: 'Wins',
        width: 100,
        sortable: true
      },
      {
        key: 'losses',
        name: 'Losses',
        width: 100,
        sortable: true
      },
      {
        key: 'draws',
        name: 'Draws',
        width: 100,
        sortable: true
      },
      {
        key: 'goalsFor',
        name: 'Goals For',
        width: 150,
        sortable: true
      },
      {
        key: 'goalsAgainst',
        name: 'Goals Against',
        width: 150,
        sortable: true
      },
      {
        key: 'points',
        name: 'Points',
        width: 120,
        sortable: true
      },
    ];
  }

  rowGetter = (i) => {
    return this.standings[i];
  }

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    }

    const rows = sortDirection === 'NONE' ? this.standings.slice(0) : this.standings.sort(comparer);
  }

  calculateScore(fixture) {
      if (fixture.status === 'complete') {
          return (<div>
            <div>{fixture.homeTeamScore} - {fixture.awayTeamScore}</div>
            <div onClick={() => this.props.store.showFixturePage(fixture.fixtureId)} className="fa fa-arrow-right"></div>
          </div>)
      } else {
          return (<div></div>)
      }
  }

  createTeamLink(teamUid, teamName) {
    return (
      <a onClick={() => this.props.store.showSquadPage(teamUid)}>{teamName}</a>
    )
  }

  createTeamLinkUrl = (row) => {
    return (
      <a onClick={() => this.props.store.showSquadPage(row.dependentValues.teamUid)}>{row.dependentValues.teamName}</a>
    )
  } 

  allFixtures() {
      const fixtures = this.props.view.leagueModel.value.fixtures.map((fixture) => {
          return (
            <div className="row">
                <div>{fixture.gameDate}</div>
                <div><img src={fixture.homeTeamLogo}/>{this.createTeamLink(fixture.homeTeam, fixture.homeTeamName)}</div>
                <div><img src={fixture.awayTeamLogo}/>{this.createTeamLink(fixture.awayTeam, fixture.awayTeamName)}</div>
                {this.calculateScore(fixture)}
            </div>
          )
      })
      return fixtures
  }

  calculateStandings() {
    for(let team of this.props.view.leagueModel.value.teams) {
      this.standings.push({ teamName: team.teamName })
    }
    for(let row of this.standings) {
      const results = this.countResults(row.teamName)
      row.played = results.played
      row.wins = results.wins
      row.losses = results.losses
      row.draws = results.draws
      row.goalsFor = results.goalsFor
      row.goalsAgainst = results.goalsAgainst
      row.points = results.points
    }
    this.sortStandings()
  }

  sortStandings() {
    function compare(a,b) {
      if (b.points < a.points)
        return -1;
      if (b.points > a.points)
        return 1;
      return 0;
    }
    this.standings.sort(compare)
  }

  countResults(teamName) {
    let results = {
      played: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    }
    for (let fixture of this.props.view.leagueModel.value.fixtures) {
      const homeTeamScore = fixture.homeTeamScore
      const awayTeamScore = fixture.awayTeamScore
      if (fixture.status === 'complete') {
        if (homeTeamScore > awayTeamScore) {
          if (fixture.homeTeamName === teamName) {
            results.played++
            results.wins++
            results.goalsFor += fixture.homeTeamScore
            results.goalsAgainst += fixture.awayTeamScore
            results.points += 3
          } else if (fixture.awayTeamName === teamName) {
            results.played++
            results.losses++
            results.goalsFor += fixture.awayTeamScore
            results.goalsAgainst += fixture.homeTeamScore
          }
        } else if (homeTeamScore < awayTeamScore) {
          if (fixture.awayTeamName === teamName) {
            results.played++
            results.wins++
            results.goalsFor += fixture.awayTeamScore
            results.goalsAgainst += fixture.homeTeamScore
            results.points += 3
          } else if (fixture.homeTeamName === teamName) {
            results.played++
            results.losses++
            results.goalsFor += fixture.homeTeamScore
            results.goalsAgainst += fixture.awayTeamScore
          }
        } else if (homeTeamScore === awayTeamScore) {
          if (fixture.homeTeamName === teamName) {
            results.played++
            results.draws++
            results.goalsFor += fixture.homeTeamScore
            results.goalsAgainst += fixture.awayTeamScore
            results.points += 1
          } else if (fixture.awayTeamName === teamName) {
            results.played++
            results.draws++
            results.goalsFor += fixture.awayTeamScore
            results.goalsAgainst += fixture.homeTeamScore
            results.points += 1
          }
        }
      }
    }
    return results
  }

  renderStandings() {
    this.calculateStandings()
    return (
      <div className="standings-wrapper">
        <h2>Standings</h2>
        <ReactDataGrid
        onGridSort={this.handleGridSort}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.standings.length}
        minHeight={500} />  
      </div>
    )
  }

  render() {
    switch (this.props.view.leagueModel.state) {
      case "pending":
          return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
          throw this.props.view.leagueModel.reason
      case "fulfilled":
          return (
            <div className="league-wrapper">
              <h2>Fixtures</h2>
              <div className="fixture-set">
                <div className="header">
                  <div>Date</div>
                  <div>Home</div>
                  <div>Away</div>
                  <div>Result</div>
                </div>
                {this.allFixtures()}
              </div>
              {this.renderStandings()}
            </div>
          )
    }
  }
}

League.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default League