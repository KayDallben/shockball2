import React from 'react'

import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import ReactDataGrid from 'react-data-grid'
import Spinner from 'react-spinkit'
import NumberFormat from 'react-number-format'

import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import 'bootstrap/dist/css/bootstrap.css';
import './transfers.scss'

@observer
class Transfers extends React.Component {
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
          key: 'teamName',
          name: 'Team',
          width: 180,
          formatter: this.createTeamLink,
          getRowMetaData: (data)=>(data),
          sortable: true
        },
        {
          key: 'marketValue',
          name: 'Value',
          width: 100,
          formatter: this.marketValueFormat,
          getRowMetaData: (data)=>(data),
          sortable: true
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
          key: 'energy',
          name: 'Energy',
          width: 100,
          sortable: true
        },
        {
          key: 'morale',
          name: 'Morale',
          sortable: true
        }
      ];
  }

  marketValueFormat = (row) => {
    return (
      <NumberFormat value={row.dependentValues.marketValue} displayType={'text'} thousandSeparator={true} prefix={'$'} />
    )
  }

  createPlayerLink = (row) => {
    return (
      <a onClick={() => this.props.store.showPlayerPage(row.dependentValues.shockballPlayerUid)}>{row.dependentValues.name}</a>
    )
  }

  createTeamLink = (row) => {
    const teamValue = row.dependentValues.teamName ? row.dependentValues.teamName : 'Free Agent'
    if (teamValue === 'Free Agent') {
      return (
        <div>{teamValue}</div>
      )
    } else {
      return (
        <a onClick={() => this.props.store.showSquadPage(row.dependentValues.teamUid)}>{row.dependentValues.teamName}</a>
      )
    }
  }

  rowGetter = (i) => {
    return this.props.view.players.value[i];
  }

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    }

    const rows = sortDirection === 'NONE' ? this.props.view.players.value.slice(0) : this.props.view.players.value.sort(comparer);
  }

  allPlayers() {
    return (
      <div>
        <h2 className="section-title">Transfer Market</h2>
        <ReactDataGrid
        onGridSort={this.handleGridSort}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.props.view.players.value.length}
        minHeight={500} />
      </div>
    )
  }

  render() {
    switch (this.props.view.players.state) {
      case "pending":
          return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
          throw this.props.view.players.reason
      case "fulfilled":
          return (
            <div className="transfers-wrapper">
                {this.allPlayers()}
            </div>
          )
    }
  }
}

Transfers.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default Transfers