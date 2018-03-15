import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import ExtendableError from '../errors/ExtendableError'
import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './navigation.scss'
export class NavigationError extends ExtendableError {}

@observer
class Navigation extends React.Component {
  constructor(props) {
    super(props)
  }

  mapItems() {
    try {
      let domArray = []
      domArray = this.props.store.navData.navLinks.map((item, index) => {
        const className = 'title-icon ' + item.icon
        const linkPath = item.title === 'Me' ? '' : item.title.toLowerCase()
        return (
          <a onClick={() => { item.routeMethod()}}>
            <div key={index}>
              <div className={className}></div>
              <div className="title">{item.title}</div>
            </div>
          </a>
        )
      })
      return domArray
    } catch (e) {
      throw new NavigationError("Map items", e);
    }
  }

  render() {
    return (
      <div className="navigation">
        <div className="nav-wrapper">
          {this.mapItems()}
        </div>
      </div>
    )
  }
}

Navigation.propTypes = {
  store: PropTypes.object
}
export default Navigation