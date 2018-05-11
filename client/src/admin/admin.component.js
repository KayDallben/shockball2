import React from 'react'
import moment from 'moment'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import ReactDataGrid from 'react-data-grid'
import { toast } from 'react-toastify'

import NumberFormat from 'react-number-format'
import './admin.scss'


@observer
class Admin extends React.Component {
  constructor(props) {
    super(props)
    this._contractColumns = [
      {
        key: 'teamName',
        name: 'Team',
        formatter: this.createContractReviewLink,
        getRowMetaData: (data)=>(data),
        width: 200
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
        width: 120,
        formatter: this.actionsFormat,
        getRowMetaData: (data)=>(data)
      }
    ]
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
    if (this.props.store.currentUser.isAdmin === true) {
      return (
        <div className="btn btn-secondary" onClick={() => this.approveContract(row)}>Approve/Reject</div>
      )
    } else {
      return null
    }
  }

  approveContract(rowData) {
    const playerContract = rowData.dependentValues
    this.props.store.showModal(
      <div className="contract-wrapper">
        <div className="modal-title">Approve/Reject Contract</div>
        <div className="player-value">
          <h3>Signing Player:</h3>
          <div className="player-photo">
            <div className="player-name">{playerContract.playerName}</div>
          </div>
          <h3>Signing Team:</h3>
          <div className="team">
            <div className="team-name">{playerContract.teamName}</div>
          </div>
        </div>
        <div className="contract-offer">
          <h3>Contract Bid:</h3>
          {this.renderContractFields(playerContract)}
          {this.renderContractActions(playerContract)}
        </div>
      </div>
    )
  }

  renderContractFields(contract) {
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
        <div className="contract-item">
          <div className="label">Contract Created</div>
          <div className="item-value">{moment(contract.created).format('L')}</div>
        </div>
      </div>
    )
  }

  deleteContract(playerContract) {
    this.props.store.deleteContract(playerContract.contractUid, 'admin').then(() => {
      toast.success("Contract deleted!", {
        position: toast.POSITION.TOP_CENTER
      })
      this.props.store.closeModal()
    }).catch(() => {
      toast.error("Sheeeeit, problem deleting contract.", {
        position: toast.POSITION.TOP_CENTER
      })
      this.props.store.closeModal()
    })
  }

  activateContract(playerContract) {
    this.props.store.updateContractState(playerContract.contractUid, 'active', 'office', true).then(() => {
      toast.success("Contract activated!", {
        position: toast.POSITION.TOP_CENTER
      })
      this.props.store.closeModal()
    }).catch(() => {
      toast.error("Sheeeeit, problem activating contract.", {
        position: toast.POSITION.TOP_CENTER
      })
      this.props.store.closeModal()
    })
  }

  renderContractActions(contract) {
    return (
      <div className="contract-action-holder">
        <button type="submit" className="mb-4 btn btn-danger" onClick={() => {this.deleteContract(contract)}}>Delete</button>
        <button type="submit" className="mb-4 btn btn-success" onClick={() => {this.activateContract(contract)}}>Activate</button>
      </div>
    )
  }

  contractRowGetter = (i) => {
    return this.props.view.adminModel.value.contracts[i]
  }

  renderContracts() {
    if (this.props.store.currentUser.isAdmin === true) {
      return (
        <div className="inner-wrapper">
          <h2 className="contract-header">Accepted Contracts</h2>
          <div className="contracts-data-grid">
            <ReactDataGrid
              columns={this._contractColumns}
              rowGetter={this.contractRowGetter}
              rowsCount={this.props.view.adminModel.value.contracts.length}
              minHeight={200} />
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    switch (this.props.view.adminModel.state) {
      case "pending":
          return <Spinner name='ball-scale-ripple-multiple' />
      case "rejected":
          throw this.props.view.adminModel.reason
      case "fulfilled":
          return (
            <div className="admin-wrapper">
              {this.renderContracts()}
            </div>
          )
    }
  }
}

Admin.propTypes = {
  store: PropTypes.object,
  view: PropTypes.object
}

export default Admin