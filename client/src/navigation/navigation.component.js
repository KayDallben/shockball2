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
            <div className="title-and-icon" key={index}>
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

  mapAdmin() {
    try {
      if (this.props.store.currentUser.isAdmin) {
        return (
          <a onClick={() => this.props.store.showAdminPage()}>
            <div className="title-and-icon" key={1337}>
              <div className="title-icon fas fa-edit"></div>
              <div className="title">Admin</div>
            </div>
          </a>
        )
      } else {
        return null
      }
    } catch (e) {
      throw new NavigationError("Map admin items", e);
    }
  }

  render() {
    return (
      <div className="navigation">
        <div className="nav-wrapper">
          {this.mapItems()}
          {this.mapAdmin()}
        </div>
      </div>
    )
  }
}

Navigation.propTypes = {
  store: PropTypes.object
}
export default Navigation