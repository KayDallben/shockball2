import React from 'react'
import { Route } from 'react-router-dom'
import moment from 'moment'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import ReactDataGrid from 'react-data-grid'
import { toast } from 'react-toastify'

import NumberFormat from 'react-number-format'

import './office.scss'

@observer
class Office extends React.Component {
  constructor(props) {
    super(props)
    this._contractColumns = [
      {
        key: 'teamName',
        name: 'Team',
        formatter: this.createContractReviewLink,
        getRowMetaData: (data)=>(data),
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
      },
      {
        key: '',
        name: 'Actions',
        width: 80,
        formatter: this.actionsFormat,
        getRowMetaData: (data)=>(data)
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

  createContractReviewLink = (row) => {
    if (this.props.store.currentUser.teamManager) {
      return (
        <div>{row.dependentValues.teamName}</div>
      )
    } else {
        //TODO - return link to squad page
      return (
        <div>{row.dependentValues.teamName}</div>
      ) 
    }
  }

  createPlayerLink = (row) => {
    if (this.props.store.currentUser.teamManager) {
      return (
        <a onClick={() => this.props.store.showPlayerPage(row.dependentValues.playerUid)}>{row.dependentValues.playerName}</a>
      )
    } else {
      return (
        <div>{row.dependentValues.playerName}</div>
      )
    }
  }

  actionsFormat = (row) => {
    if (this.props.store.currentUser.contractUid && !this.props.store.currentUser.teamManager) {
      //current user has a contract and is not a manager - so is a league playe
      return (
        <div></div>
      )
    } else if (!this.props.store.currentUser.contractUid && !this.props.store.currentUser.teamManager) {
      // current user has no contract and is not a manager - so is a free agent
      if (row.dependentValues.status === 'pending') {
        return (
          <div className="btn btn-secondary" onClick={() => this.editContract(row)}>Review</div>
        )
      } else {
        return (<div></div>)
      }
    } else if (this.props.store.currentUser.contractUid && this.props.store.currentUser.teamManager) {
      // EDGE CASE! current user has both a team contract AND is a team manager.  We don't want to support this.
      console.error(this.props.store.currentUser.name + ' is both a player and a manager! No Bueno!')
      return (
        <div></div>
      )
    } else {
      // current user has no contract and is a manager - so is a team manager
      return (
        <div></div>
      )
    }
  }

  renderContractFields(contract) {
    if (contract.status === 'accepted' && !contract.isFeePaid) {
      return (
        <div className="inner-contract-fields">
          <div className="fee-title">League Fee Required: <NumberFormat value={1000000} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
          <p className="disclaimer">Disclaimer: because the actual payment is made via an external system (star wars combine), the Shockball application cannot validate that your payment was made. Processing your payment is a manual task
            where our administrators check the payment events from Star Wars Combine, validate authenticity, and then update the ShockBall league to reflect your payment.  We try to be timely.
          </p>
        </div>
      )
    } else if (contract.status ==='pending') {
      return (
        <div className="inner-contract-fields">
          <div className="contract-item">
            <div className="label">Purchase Price</div>
            <div className="item-value"><NumberFormat value={contract.purchasePrice} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
          </div>
          <div className="contract-item">
            <div className="label">Pick Season</div>
            <div className="item-value">{contract.season}</div>
          </div>
        </div>
      )
    }
  }

  renderContractActions(contract) {
    if (contract.status === 'accepted' && !contract.isFeePaid) {
      return (
        <div className="contract-action-holder"></div>
      )
    } else {
      return (
        <div className="contract-action-holder">
          <button type="submit" className="mb-4 btn btn-danger" onClick={() => {this.rejectContract(contract)}}>Reject</button>
          <button type="submit" className="mb-4 btn btn-success" onClick={() => {this.acceptContract(contract)}}>Accept</button>
        </div>
      )
    }
  }

  sendManagerCreditsLink(amount, managerUid, managerName, teamUid, teamName) {
    const receiver = encodeURIComponent('Tholme So')
    const communication = `Shockball Team Deposit | Manager ID: ${managerUid} | Manager Name: ${managerName} | Team ID: ${teamUid}, Team Name: ${teamName}`
    window.open(`http://www.swcombine.com/members/credits/?receiver=${receiver}&amount=${amount}&communication=${communication}`, '_blank')
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      return;
    }
    const form = event.target;
    const data = new FormData(form);
    const sanitizedAmount = parseFloat(data.get('amount'))
    this.sendManagerCreditsLink(sanitizedAmount, this.props.store.currentUser.shockballPlayerUid, this.props.store.currentUser.name, this.props.store.currentUser.teamUid, this.props.store.currentUser.teamName)
  }

  showDepositForm() {
    this.props.store.showModal(
      <div className="contract-wrapper">
        <div className="modal-title">Deposit Team Funds</div>
        <div className="player-value">
            <h3>Team:</h3>
            <div>{this.props.store.currentUser.teamName}</div>
        </div>
        <div className="contract-offer">
          <h3>Team Budget Transaction:</h3>
          <form novalidate onSubmit={this.handleSubmit.bind(this)} id="deposit">
            <p className="disclaimer">Disclaimer: because the actual payment is made via an external system (star wars combine), the Shockball application cannot validate that your payment was made. Processing your payment is a manual task
              where our administrators check the payment events from Star Wars Combine, validate authenticity, and then update the ShockBall league to reflect your payment.  We try to be timely.
            </p>
            <p className="disclaimer">Once we manually update your Team Budgets with your deposit amount, you will then see it reflected on your Office account statement section.</p>
            <label htmlFor="amount">Enter Deposit Amount</label>
            <input id="amount" name="amount" type="number" data-parse="number" min="0" required />

            <button type="submit" className="mb-4 btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    )
  }

  editContract(rowData) {
    //currently assumes only free agent is calling this method - 3/30/2018
    const playerContract = rowData.dependentValues
    this.props.store.showModal(
      <div className="contract-wrapper">
        <div className="modal-title">Update Contract</div>
        <div className="player-value">
            <h3>Player:</h3>
            <div className="player-photo">
              <img src={this.props.store.currentUser.image}/>
            </div>
            <div className="total-value">
              <div>Market Value:</div>
              <NumberFormat value={this.props.store.currentUser.marketValue} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
        </div>
        <div className="contract-offer">
          <h3>Contract Bid:</h3>
          {this.renderContractFields(playerContract)}
          {this.renderContractActions(playerContract)}
        </div>
      </div>
    )
  }

  acceptContract(playerContract) {
    this.props.store.updateContractState(playerContract.contractUid, 'accepted', 'office').then(() => {
      toast.success("Contract accepted!", {
        position: toast.POSITION.TOP_CENTER
      })
      this.props.store.closeModal()
    }).catch(() => {
      toast.error("Sheeeeit, problem accepting contract.", {
        position: toast.POSITION.TOP_CENTER
      })
      this.props.store.closeModal()
    })
  }

  rejectContract(playerContract) {
    this.props.store.updateContractState(playerContract.contractUid, 'rejected', 'office').then(() => {
      toast.success("Contract rejected!", {
        position: toast.POSITION.TOP_CENTER
      })
      this.props.store.closeModal()
    }).catch(() => {
      toast.error("Sheeeeit, problem rejecting contract.", {
        position: toast.POSITION.TOP_CENTER
      })
      this.props.store.closeModal()
    })
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

  handleContractSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    }

    const rows = sortDirection === 'NONE' ? this.props.view.office.value.contracts.slice(0) : this.props.view.office.value.contracts.sort(comparer);
  }

  renderContracts() {
    if (this.props.store.currentUser.contractUid && !this.props.store.currentUser.teamManager) {
      //current user has a contract and is not a manager - so is a league player
      return (
        <div className="inner-wrapper">
          <div className="contract-header"></div>
          <div className="contracts-data-grid">
          </div>
        </div>
      )

    } else if (!this.props.store.currentUser.contractUid && !this.props.store.currentUser.teamManager) {
      // current user has no contract and is not a manager - so is a free agent
      return (
        <div className="inner-wrapper">
          <div className="contract-header">My Contract Offers</div>
          <div className="contracts-data-grid">
            <ReactDataGrid
              onGridSort={this.handleContractSort}
              columns={this._contractColumns}
              rowGetter={this.contractRowGetter}
              rowsCount={this.props.view.office.value.contracts.length}
              minHeight={200} />
          </div>
        </div>
      )

    } else if (this.props.store.currentUser.contractUid && this.props.store.currentUser.teamManager) {
      // EDGE CASE! current user has both a team contract AND is a team manager.  We don't want to support this.
      console.error(this.props.store.currentUser.name + ' is both a player and a manager! No Bueno!')
      return (
        <div className="inner-wrapper">
          <div className="contract-header">All Team Contracts</div>
          <div className="contracts-data-grid">
            <ReactDataGrid
              onGridSort={this.handleContractSort}
              columns={this._contractColumns}
              rowGetter={this.contractRowGetter}
              rowsCount={this.props.view.office.value.contracts.length}
              minHeight={200} />
          </div>
        </div>
      )
    } else {
      // current user has no contract and is a manager - so is a team manager
      return (
        <div className="inner-wrapper">
          <div className="contract-header">All Team Contracts</div>
          <div className="contracts-data-grid">
            <ReactDataGrid
              onGridSort={this.handleContractSort}
              columns={this._contractColumns}
              rowGetter={this.contractRowGetter}
              rowsCount={this.props.view.office.value.contracts.length}
              minHeight={200} />
          </div>
        </div>
      )
    }
  }

  getCurrentContract() {
    let currentContract = {}
    for (let contract of this.props.view.office.value.contracts) {
      if (contract.contractUid === this.props.store.currentUser.contractUid) {
        currentContract = contract
        break
      }
    }
    return currentContract
  }

  renderStatement() {
    if (this.props.store.currentUser.contractUid && !this.props.store.currentUser.teamManager) {
      //current user has a contract and is not a manager - so is a league player
      const playerContract = this.getCurrentContract()
      return (
        <div className="inner-wrapper">
          <div className="accounts">
            <div className="contract-header">Player Account</div>
            <div className="accounts-header">Account Balance: <NumberFormat value={this.props.view.office.value.account.totalBalance} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            <div className="account-info">Last Modified: {moment(this.props.view.office.value.account.lastModified).format('L')}</div>
          </div>
          <div className="accounts">
            <div className="contract-header">Active Contract</div>
            <div className="accounts-header">Team: {playerContract.teamName}</div>
            <div className="accounts-header">Purchase Price: <NumberFormat value={playerContract.purchasePrice} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            <div className="accounts-header">Season Committed: {playerContract.season}</div>
            <div className="accounts-header">Signed: {moment(playerContract.lastModified).format('L')}</div>
          </div>
        </div>
      )

    } else if (!this.props.store.currentUser.contractUid && !this.props.store.currentUser.teamManager) {
      // current user has no contract and is not a manager - so is a free agent
      return (
        <div className="inner-wrapper">
          <div className="accounts">
            <div className="contract-header">Player Account</div>
            <div className="accounts-header">Account Balance: <NumberFormat value={this.props.view.office.value.account.totalBalance} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            <div className="account-info">Last Modified: {moment(this.props.view.office.value.account.lastModified).format('L')}</div>
          </div>
        </div>
      )
    } else if (this.props.store.currentUser.contractUid && this.props.store.currentUser.teamManager) {
      // EDGE CASE! current user has both a team contract AND is a team manager.  We don't want to support this.
      console.error(this.props.store.currentUser.name + ' is both a player and a manager! No Bueno!')
      return (
        <div className="inner-wrapper">
          <div className="accounts">
            <div className="contract-header">Account Statement</div>
            <div className="accounts-header">Potential Budget: <NumberFormat value={this.props.view.office.value.account.potentialBudget} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            <div className="accounts-header">Available Budget: <NumberFormat value={this.props.view.office.value.account.availableBudget} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            <div className="account-info">Last Modified: {moment(this.props.view.office.value.account.lastModified).format('L')}</div>
          </div>
        </div>
      )
    } else {
      // current user has no contract and is a manager - so is a team manager
      return (
        <div className="inner-wrapper">
          <div className="accounts">
            <div className="contract-header">Account Statement</div>
            <div className="accounts-header">Potential Budget: <NumberFormat value={this.props.view.office.value.account.potentialBudget} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            <div className="accounts-header">Available Budget: <NumberFormat value={this.props.view.office.value.account.availableBudget} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            <div className="account-info">Last Modified: {moment(this.props.view.office.value.account.lastModified).format('LLL')}</div>
            <div className="mb-4 btn btn-primary" onClick={() => {this.showDepositForm()}}>Deposit Team Funds</div>
          </div>
        </div>
      )
    }
  }

  handleTransactionSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    }

    const rows = sortDirection === 'NONE' ? this.props.view.office.value.account.transactions.slice(0) : this.props.view.office.value.account.transactions.sort(comparer);
  }

  renderTransactions() {
    if (this.props.view.office.value.account.transactions) {
      return (
        <div className="inner-wrapper transaction-wrapper">
          <div className="contract-header">Transaction History</div>
          <div className="transactions-data-grid">
            <ReactDataGrid
              onGridSort={this.handleTransactionSort}
              columns={this._transactionColumns}
              rowGetter={this.transactionRowGetter}
              rowsCount={this.props.view.office.value.account.transactions.length}
              minHeight={200} />
          </div>
        </div>
      )
    } else {
      return null
    }
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
              {this.renderStatement()}
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