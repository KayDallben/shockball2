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
        icon: 'fa fa-user'
      },
      {
        title: 'Squad',
        icon: 'fa fa-users'
      },
      {
        title: 'Office',
        icon: 'fa fa-briefcase'
      },
      {
        title: 'League',
        icon: 'fa fa-flag'
      },
      {
        title: 'Transfers',
        icon: 'fa fa-building'
      }
    ]
  }

  @observable accessToken = sessionStorage.getItem('swcAccessToken')
  @observable authCode = sessionStorage.getItem("swcAuthorizationCode")

  @action showHomePage() {
    this.currentView = {
      name: 'home'
    }  
  }

  @action showPlayerPage() {
    this.currentView = {
      name: 'player'
    }
  }

  @action showLeaguePage() {
    this.currentView = {
      name: 'league',
      fixtures: fromPromise(this.http.getAllFixtures('./api/fixtures', this.accessToken))
    }
  }

  @action showFixturePage(fixtureId) {
    this.currentView = {
      name: 'fixture',
      fixtureId,
      fixture: fromPromise(this.http.getSingleFixture('../api/fixtures/' + fixtureId, this.accessToken))
    }
  }

  @computed get currentPath() {
    switch(this.currentView.name) {
        case "home": return "/"
        case "fixture": return `/fixture/${this.currentView.fixtureId}`
        case "league": return `/league`
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