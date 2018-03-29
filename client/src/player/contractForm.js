import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

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
        this.saveContract(data.get('purchasePrice'), data.get('games'))
      }

    }

    saveContract(purchasePrice, games) {
      const newContract = {
        playerName: this.props.signingPlayer.name,
        playerUid: this.props.signingPlayer.createdAsUid,
        purchasePrice: parseInt(purchasePrice),
        games: parseInt(games),
        salary: (purchasePrice / games),
        status: 'pending',
        teamName: this.props.signingTeam.teamName,
        teamUid: this.props.signingTeam.teamUid
      }
      this.props.store.createContract(newContract).then(() => {
        this.toastSuccess()
        this.props.store.closeModal()
      }).catch(() => {
        this.toastError()
        this.props.store.closeModal()
      })
    }

    meetsMarketRules(input) {
      if (input >= this.props.signingPlayer.marketValue) {
        return true
      } else {
        return false
      }
    }
  
    render() {
      const { displayErrors } = this.state;
      return (
        <form novalidate onSubmit={this.handleSubmit} id="contract" className={displayErrors ? 'displayErrors' : ''}>
          <label htmlFor="purchasePrice">Enter Purchase Price</label>
          <input id="purchasePrice" name="purchasePrice" type="number" data-parse="number" min="0" required />

          <label htmlFor="games">Number Games</label>
          <input id="games" name="games" type="number" data-parse="number" min="0" required />

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