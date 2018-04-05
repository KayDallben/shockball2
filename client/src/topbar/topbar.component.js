//TODO  After ExtendableError is its own external component, make the topbar an external component for future projects.
import React from 'react'
import PropTypes from 'prop-types'
import className from 'classnames'
import moment from 'moment'
import { observer } from 'mobx-react'
import Spinner from 'react-spinkit'

import ExtendableError from '../errors/ExtendableError'
import shockballLogo from './shockballLogo.png'
import './topbar.scss'

export class TopbarError extends ExtendableError {}

@observer
class TopBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        team: {
          teamLogo: 'http://www.brandcrowd.com/gallery/brands/thumbs/thumb14751184306802.jpg',
          teamLocale: 'Abregado',
          teamName: 'Gentlemen'
        },
        upcomingMatch: {
          teamLogo: 'https://vignette1.wikia.nocookie.net/limmierpg/images/4/42/Rangers.jpg/revision/latest?cb=20140503184850',
          teamLocale: 'Kashyyyk',
          teamName: 'Rangers'
        },
        countdown: moment().format("MMMM Do YYYY, h:mm a ZZ"),
        shockballLogo: '../shockballLogo.png',
        isManager: false
    }
  }

  setBackgroundImage(url, opacity) {
    const divStyle = {
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        borderRadius: '50%',
        backgroundImage: "url(" + url + ")",
        backgroundOpacity: opacity
    }
    return divStyle
  }

  renderTeamImage() {
    if (this.props.store.topBarView.currentUserTeam.value.teamPicUrl) {
      return (
        <div className="team-logo" style={this.setBackgroundImage(this.props.store.topBarView.currentUserTeam.value.teamPicUrl, '1')}></div>
      )
    } else {
      return (
        <div className="team-logo free-agent fas fa-user-secret fa-4x"></div>
      )
    }
  }

  renderTeamName() {
    if (this.props.store.topBarView.currentUserTeam.value.teamName) {
      return this.props.store.topBarView.currentUserTeam.value.teamName
    } else {
      return 'Free Agent'
    }
  }

  render() {
    switch (this.props.store.topBarView.currentUserTeam.state) {
      case "pending":
          return (
            <div className="top-header">
              <div className="header-wrapper">
                <Spinner name='ball-scale-ripple-multiple' />
              </div>
            </div>
          )
      case "rejected":
          throw this.props.store.topBarView.currentUserTeam.reason
      case "fulfilled":
        return (
          <div className="top-header">
            <div className="header-wrapper">
              <div className="team-info">
                {this.renderTeamImage()}
                <div className="team-longname">
                  <div className="team-name">{this.renderTeamName()}</div>
                  {/* <div className="team-edit button">Edit</div> */}
                </div>
              </div>
              <div className="shockball-logo-holder">
                <div className="shockball-logo" style={this.setBackgroundImage(shockballLogo, '1')}></div>
                <div className="shockball-title">Shockball</div>
              </div>
              <div className="upcoming-match-holder">
                <div className="header">
                  <div>Upcoming Match</div>
                </div>
                <div className="upcoming-content">
                  <div className="upcoming-team">
                    <div className="upcoming-team-logo" style={this.setBackgroundImage(this.state.upcomingMatch.teamLogo, '1')}></div>
                    <div className="upcoming-team-name">{this.state.upcomingMatch.teamName}</div>
                  </div>
                  <div className="countdown">{this.state.countdown}</div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }
}

TopBar.propTypes = {
  store: PropTypes.object
}

export default TopBar