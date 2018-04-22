import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
require('formdata-polyfill')


var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
});

const inputParsers = {
    date(input) {
        const [month, day, year] = input.split('/');
        return `${year}-${month}-${day}`;
    },
    number(input) {
        const numberInput = parseFloat(input)
        // return formatter.format(numberInput);
        return numberInput;
    }
};

class ContractForm extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      this.state = {
        displayErrors: ''
      }
    }

    toastSuccess = () => {
      toast.success("Contract bid sent!", {
        position: toast.POSITION.TOP_CENTER
      })
    }

    toastError = () => {
      toast.error("SCHEISSE! Unable to create Contract bid :(", {
        position: toast.POSITION.TOP_CENTER
      })
    }
  
    handleSubmit(event) {
      event.preventDefault();
      if (!event.target.checkValidity()) {
        this.setState({ displayErrors: true });
        return;
      }
      this.setState({ displayErrors: false });
      
      const form = event.target;
      const data = new FormData(form);
      const formKeys = data.keys()

      for (let name of formKeys) {
        const input = form.elements[name];
        const parserName = input.dataset.parse;
  
        if (parserName) {
          const parser = inputParsers[parserName];
          const parsedValue = parser(data.get(name));
          data.set(name, parsedValue);
        }
      }

      if (this.meetsMarketRules(data.get('purchasePrice'))) {
        const purchasePrice = data.get('purchasePrice')
        if (purchasePrice < this.props.signingPlayer.marketValue) {
          toast.error("Must offer player a minimum bid equal to their market value.", {
            position: toast.POSITION.TOP_CENTER
          })
        } else {
          this.saveContract(purchasePrice, data.get('season'))
        }
      }

    }

    saveContract(purchasePrice, season) {
      const newContract = {
        playerName: this.props.signingPlayer.name,
        playerUid: this.props.signingPlayer.shockballPlayerUid,
        purchasePrice: parseInt(purchasePrice),
        season: parseInt(season),
        status: 'pending',
        teamName: this.props.signingTeam.teamName,
        teamUid: this.props.signingTeam.teamUid,
        isFeePaid: false
      }
      this.props.store.createContract(newContract).then(() => {
        this.toastSuccess()
        this.props.store.closeModal()
      }).catch(error => {
        if (error.response.data === 'Cannot spend more than available team budget!') {
          toast.error(error.response.data, {
            position: toast.POSITION.TOP_CENTER
          })
        } else {
          toast.error(error.response.data, {
            position: toast.POSITION.TOP_CENTER
          })
          this.props.store.closeModal()
        }
      })
    }

    meetsMarketRules(input) {
      if (input >= this.props.signingPlayer.marketValue) {
        return true
      } else {
        return false
        this.toastError()
      }
    }
  
    render() {
      const { displayErrors } = this.state;
      return (
        <form novalidate onSubmit={this.handleSubmit} id="contract" className={displayErrors ? 'displayErrors' : ''}>
          <label htmlFor="purchasePrice">Enter Purchase Price</label>
          <input id="purchasePrice" name="purchasePrice" type="number" data-parse="number" min={this.props.signingPlayer.marketValue} required />

          <label htmlFor="season">Pick Season</label>
          <input id="season" name="season" type="number" data-parse="number" min="1" max="1" value="1" required />

          <button type="submit" className="mb-4 btn btn-primary">Send Contract</button>
        </form>
      );
    }
  }

  ContractForm.propTypes = {
    store: PropTypes.object,
    signingTeam: PropTypes.object,
    signingPlayer: PropTypes.object
  }
  
  export default ContractForm