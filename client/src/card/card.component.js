import React from 'react'
import PropTypes from 'prop-types'

import ExtendableError from '../errors/ExtendableError'

export class CardError extends ExtendableError {}

class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.id,
      properties: this.mapProperties(props.properties),
      name: props.name,
      isIncremented: true,
      isDecremented: false
    }
  }

  mapProperties(properties) {
    try {
      let propertyArray = []
      if (properties) {
        propertyArray = properties.map((prop, index) => {
          return <div key={index}>{prop.test}</div>
        })
      }
      return propertyArray
    } catch (e) {
      throw new CardError("Map Properties", e);
    }
  }

  render() {
    return (  
      <div className="card-wrapper">
          <h2>{this.state.name}</h2>
          {this.state.properties}
          <div>{this.state.id}</div>
      </div>
    )
  }
}

Card.propTypes = {
  'name': PropTypes.string.isRequired,
  'id': PropTypes.number.isRequired,
  'properties': PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Card