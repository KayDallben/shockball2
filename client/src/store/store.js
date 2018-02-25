import {
  observable,
  action,
  computed,
  useStrict
} from 'mobx'
import axios from 'axios'
const hostUrl = window.location.protocol + "//" + window.location.host + "/"

useStrict(true)

class Store {
  // Values marked as 'observable' can be watched by 'observers'
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

  @observable currentUser = {
    image: ''
  }
  @observable currentUserTeam = {}
  @observable accessToken = sessionStorage.getItem('swcAccessToken')
  @observable authCode = sessionStorage.getItem("swcAuthorizationCode")


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
      // url: 'http://localhost:8080/api/teams/' + teamUid,
      params: {
        access_token: this.accessToken
      }
    }).then(response => {
      this.setUserTeam(response.data)
    });
  }
  // In strict mode, only actions can modify mobx state 
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
    //Managing Async tasks like ajax calls with Mobx actions
    axios({
      method: 'GET',
      url: './api/profile',
      // url: 'http://localhost:8080/api/profile',
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
      //we need access token, so go get it
      this.sendToLoginPage()
    }
  }
}

export default Store;