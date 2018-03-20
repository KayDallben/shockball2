import React from 'react'

import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import ReactDataGrid from 'react-data-grid';


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
            locked: true,
            formatter: this.createPlayerLink,
            getRowMetaData: (data)=>(data)
        },
        {
          key: 'createdAsUid',
          name: 'ID',
          width: 200,
          sortable: true
        },
        {
          key: 'throwing',
          name: 'Throwing',
          width: 200,
          sortable: true
        },
        {
          key: 'passing',
          name: 'Passing',
          width: 200,
          sortable: true
        },
        {
          key: 'blocking',
          name: 'Blocking',
          width: 200,
          sortable: true
        }
      ];
  }

  createPlayerLink = (row) => {
    return (
      <a onClick={() => this.props.store.showPlayerPage(row.dependentValues.createdAsUid)}>{row.dependentValues.name}</a>
    )
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
        <ReactDataGrid
        onGridSort={this.handleGridSort}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.props.view.players.value.length}
        minHeight={500} />
    )
  }

  render() {
    switch (this.props.view.players.state) {
      case "pending":
          return <h1>Loading free agents..</h1>
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