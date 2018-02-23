import React from 'react'
import { Route } from 'react-router-dom'

import ExtendableError from '../errors/ExtendableError'
import ErrorBoundary from '../errorBoundary/errorBoundary.component'
import './navigation.scss'
export class NavigationError extends ExtendableError {}

class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      navItems: this.mapItems(props.navLinks)
    }
  }

  mapItems(items) {
    try {
      let domArray = []
      if (items) {
        domArray = items.map((item, index) => {
          const className = 'title-icon ' + item.icon
          return <div key={index}>
            <div className={className}></div>
            <div className="title">{item.title}</div>
          </div>
        })
      }
      return domArray
    } catch (e) {
      throw new NavigationError("Map items", e);
    }
  }

  render() {
    return (
      <div className="navigation">
        <div className="nav-wrapper">
          {this.state.navItems}
        </div>
      </div>
    )
  }
}

export default Navigation