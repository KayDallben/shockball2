import {
  observable,
  action,
  computed,
  useStrict
} from 'mobx'
import { fromPromise } from 'mobx-utils'
import axios from 'axios'
import moment from 'moment'

const hostUrl = window.location.protocol + "//" + window.location.host + "/"

useStrict(true)

class Store {
  http = null;
  
  constructor(http) {
    this.http = http
  }

  @observable currentView = null
  @observable currentUser = {
    image: ''
  }
  @observable currentUserTeam = {}
  @observable navData = {
    navLinks: [
      {
        title: 'Me',
        icon: 'fa fa-user',
        routeMethod: this.showPlayerPage.bind(this)
      },
      {
        title: 'Squad',
        icon: 'fa fa-users',
        routeMethod: this.showSquadPage.bind(this)
      },
      {
        title: 'Office',
        icon: 'fa fa-briefcase',
        routeMethod: this.showOfficePage.bind(this)
      },
      {
        title: 'League',
        icon: 'fa fa-flag',
        routeMethod: this.showLeaguePage.bind(this)
      },
      {
        title: 'Transfers',
        icon: 'fa fa-building',
        routeMethod: this.showTransfersPage.bind(this)
      }
    ]
  }

  @observable accessToken = sessionStorage.getItem('swcAccessToken')
  @observable authCode = sessionStorage.getItem("swcAuthorizationCode")

  @action showHomePage() {
    this.currentView = {
      name: 'home',
      player: fromPromise(this.http.genericFetch('../api/players/' + this.currentUser.createdAsUid, this.accessToken))
    }  
  }

  @action showOfficePage() {
    this.currentView = {
      name: 'office'
    }  
  }

  @action showTransfersPage() {
    this.currentView = {
      name: 'transfers'
    }
  }

  @action showPlayerPage(playerId) {
    const defaultId = playerId ? playerId : this.currentUser.createdAsUid
    this.currentView = {
      name: 'player',
      playerId,
      player: fromPromise(this.http.genericFetch('../api/players/' + defaultId, this.accessToken))
    }
  }

  @action showSquadPage(squadId) {
    const defaultSquad = squadId ? squadId : this.currentUser.teamUid 
    this.currentView = {
      name: 'squad',
      squadId,
      squad: fromPromise(this.http.genericFetch('../api/teams/' + defaultSquad, this.accessToken))
    }
  }

  @action showLeaguePage() {
    this.currentView = {
      name: 'league',
      fixtures: fromPromise(this.http.getAllFixtures('../api/fixtures', this.accessToken))
    }
  }

  @action showFixturePage(fixtureId) {
    this.currentView = {
      name: 'fixture',
      fixtureId,
      fixture: fromPromise(this.http.getSingleFixture('../api/fixtures/' + fixtureId, this.accessToken))
    }
  }

  @action showTransfersPage() {
    this.currentView = {
      name: 'transfers',
      players: fromPromise(this.http.genericFetch('../api/players', this.accessToken))
    }
  }

  @computed get currentPath() {
    switch(this.currentView.name) {
        case "home": return "/"
        case "player": return `/player/${this.currentView.playerId}`
        case "fixture": return `/fixture/${this.currentView.fixtureId}`
        case "league": return `/league`
        case "squad": return `/squad/${this.currentView.squadId}`
        case "office": return `/office`
        case "transfers": return `/transfers`
    }
  }

  @computed get isAuthenticated() {
    return this.currentUser !== null
  }
  @computed get hasAccessToken() {
    return this.accessToken !== null
  }
  @computed get hasAuthCode() {
    return this.authCode !== null
  }


  @action getUserTeam = (teamUid) => {
    axios({
      method: 'GET',
      url: './api/teams/' + teamUid,
      params: {
        access_token: this.accessToken
      }
    }).then(response => {
      this.setUserTeam(response.data)
    });
  }
  @action performSwcLogin = () => {
    window.location.href = "http://www.swcombine.com/ws/oauth2/auth/?response_type=code&client_id=ac3e2848095aa5cb82f91f7fc7ac7ad53b5a51a1&scope=CHARACTER_READ&redirect_uri=" + hostUrl + "authorize/index.html&state=auth&access_type=offline"
  }
  @action sendToLoginPage = () => {
    window.location.href = hostUrl + 'authorize/index.html'
  }
  @action setUser = (data) => {
    this.currentUser = data
  }
  @action setUserTeam = (data) => {
    this.currentUserTeam = data
  }

  @action setUserProfile = () => {
    axios({
      method: 'GET',
      url: './api/profile',
      params: {
        access_token: this.accessToken
      }
    }).then(response => {
      console.log(response.data)
      this.setUser(response.data)
      if (response.data.teamUid) {
        this.getUserTeam(response.data.teamUid)
      }
    });
  }
  @action handleUserSetup = () => {
    if (this.hasAccessToken) {
      this.setUserProfile()
    } else if (!this.hasAccessToken) {
      this.sendToLoginPage()
    }
  }

}

export default Store;