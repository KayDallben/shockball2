import React from 'react'
import { Route } from 'react-router-dom'
import moment from 'moment'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import ReactDataGrid from 'react-data-grid'

import NumberFormat from 'react-number-format'

import './office.scss'

@observer
class Office extends React.Component {
  constructor(props) {
    super(props)
    this._contractColumns = [
      {
        key: 'teamName',
        name: 'Team'
      },
      {
        key: 'playerName',
        name: 'Player',
        width: 200,
        formatter: this.createPlayerLink,
        getRowMetaData: (data)=>(data),
        sortable: true
      },
      {
        key: 'created',
        name: 'Created',
        width: 100,
        formatter: this.createDate,
        getRowMetaData: (data)=>(data),
        sortable: true
      },
      {
        key: 'contractEndDate',
        name: 'Contract End Date',
        width: 160,
        formatter: this.createEndDate,
        getRowMetaData: (data)=>(data),
        sortable: true
      },
      {
        key: 'purchasePrice',
        name: 'Purchase Price',
        width: 130,
        formatter: this.purchasePriceFormat,
        getRowMetaData: (data)=>(data),
        sortable: true
      },
      {
        key: 'salary',
        name: 'Salary',
        width: 100,
        formatter: this.salaryFormat,
        getRowMetaData: (data)=>(data),
        sortable: true
      },
      {
        key: 'status',
        name: 'Status',
        width: 100,
        sortable: true
      }
    ]
    this._transactionColumns = [
      {
        key: 'activityType',
        name: 'Activity Type',
        sortable: true
      },
      {
        key: 'timestamp',
        name: 'Date',
        width: 200,
        formatter: this.createTransactionDate,
        getRowMetaData: (data)=>(data),
        sortable: true
      },
      {
        key: 'amount',
        name: 'Amount',
        width: 100,
        formatter: this.transactionAmountFormat,
        getRowMetaData: (data)=>(data),
        sortable: true
      }
    ]
  }

  createTransactionDate = (row) => {
    return (
      <div>{moment(row.dependentValues.timestamp).format('LLL')}</div>
    )
  }

  transactionAmountFormat = (row) => {
    return (
      <NumberFormat value={row.dependentValues.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} />
    )
  }

  createDate = (row) => {
    return (
      <div>{moment(row.dependentValues.created).format('L')}</div>
    )
  }

  createEndDate = (row) => {
    return (
      <div>{moment(row.dependentValues.contractEndDate).format('L')}</div>
    )
  }

  createPlayerLink = (row) => {
    return (
      <a onClick={() => this.props.store.showPlayerPage(row.dependentValues.playerUid)}>{row.dependentValues.playerName}</a>
    )
  }

  purchasePriceFormat = (row) => {
    return (
      <NumberFormat value={row.dependentValues.purchasePrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />
    )
  }

  salaryFormat = (row) => {
    return (
      <NumberFormat value={row.dependentValues.salary} displayType={'text'} thousandSeparator={true} prefix={'$'} />
    )
  }

  contractRowGetter = (i) => {
    return this.props.view.office.value.contracts[i];
  }

  transactionRowGetter = (i) => {
    return this.props.view.office.value.account.transactions[i];
  }

  renderContracts() {
    return (
      <div className="inner-wrapper">
        <div className="contract-header">Current Contracts</div>
        <div className="contracts-data-grid">
          <ReactDataGrid
            columns={this._contractColumns}
            rowGetter={this.contractRowGetter}
            rowsCount={this.props.view.office.value.contracts.length}
            minHeight={200} />
        </div>
      </div>
    )
  }

  renderTeamAccountStatement() {
    if (this.props.store.currentUser.teamManager) {
      return (
        <div className="inner-wrapper">
          <div className="accounts">
            <div className="contract-header">Account Statement</div>
            <div className="accounts-header">Potential Budget: <NumberFormat value={this.props.view.office.value.account.potentialBudget} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            <div className="accounts-header">Available Budget: <NumberFormat value={this.props.view.office.value.account.availableBudget} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            <div className="account-info">Last Modified: {moment(this.props.view.office.value.account.lastModified).format('LLL')}</div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  renderTransactions() {
    return (
      <div className="inner-wrapper transaction-wrapper">
        <div className="contract-header">Transaction History</div>
        <div className="transactions-data-grid">
          <ReactDataGrid
            columns={this._transactionColumns}
            rowGetter={this.transactionRowGetter}
            rowsCount={this.props.view.office.value.account.transactions.length}
            minHeight={200} />
        </div>
      </div>
    )
  }

  render() {
    switch (this.props.view.office.state) {
      case "pending":
          return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
          throw this.props.view.office.reason
      case "fulfilled":
        return (
          <div className="office-wrapper">
            <div className="team-info">
              {this.renderTeamAccountStatement()}
              {this.renderTransactions()}
            </div>
            {this.renderContracts()}
          </div>
        )
    }
  }
}

Office.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default Office