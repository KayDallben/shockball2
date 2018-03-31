import {
  observable,
  action,
  computed,
  useStrict
} from 'mobx'
import { fromPromise } from 'mobx-utils'
import axios from 'axios'
import moment from 'moment'
import { toast } from 'react-toastify'
import * as ga from '../ga/ga'

const hostUrl = window.location.protocol + "//" + window.location.host + "/"

useStrict(true)

class Store {
  http = null;
  
  constructor(http) {
    this.http = http
  }
  @observable modal = {
    show: false,
    body: null
  }
  @observable currentView = null
  @observable topBarView = {
    currentUserTeam: {
      value: {
        teamPicUrl: '',
        teamName: '',
      },
      state: 'pending'
    }
  }
  @observable currentUser = {
    image: ''
  }
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

  @action showModal(body) {
    this.modal.show = true
    this.modal.body = body
  }

  @action closeModal() {
    this.modal.show = false
    this.modal.body = null
  }

  @action showHomePage() {
    ga.pageview()
    this.currentView = {
      name: 'home',
      player: fromPromise(this.http.genericFetch(hostUrl + 'api/players/' + this.currentUser.createdAsUid, this.accessToken))
    }  
  }

  @action showOfficePage() {
    ga.pageview()
    if (this.currentUser.teamManager) {
      this.currentView = {
        name: 'office',
        office: fromPromise(this.http.fetchTeamAdmin(this.currentUser.teamManager, this.accessToken))
      }
    } else {
      this.currentView = {
        name: 'office',
        office: fromPromise(this.http.fetchPlayerAdmin(this.currentUser.createdAsUid, this.accessToken))
      }
    }
  }

  @action showPlayerPage(playerId) {
    ga.pageview()
    if (playerId) {
      this.currentView = {
        name: 'player',
        playerId,
        player: fromPromise(this.http.genericFetch(hostUrl + 'api/players/' + playerId, this.accessToken))
      }  
    } else if (!playerId && this.currentUser.createdAsUid) {
      this.currentView = {
        name: 'player',
        playerId,
        player: fromPromise(this.http.genericFetch(hostUrl + 'api/players/' + this.currentUser.createdAsUid, this.accessToken))
      }  
    } else if (!playerId && !this.currentUser.createdAsUid) {
      this.currentView = {
        name: 'player',
        playerId,
        player: fromPromise(this.setUserProfile())
      }
    }
  }

  @action showUserTeam = (teamId) => {
    this.topBarView = {
      name: 'topBar',
      teamId,
      currentUserTeam: fromPromise(this.http.genericFetch(hostUrl + 'api/teams/' + teamId, this.accessToken))
    }
  }

  @action showSquadPage(squadId) {
    ga.pageview()
    const defaultSquad = squadId ? squadId : this.currentUser.teamUid 
    this.currentView = {
      name: 'squad',
      squadId,
      squad: fromPromise(this.http.genericFetch(hostUrl + 'api/teams/' + defaultSquad, this.accessToken))
    }
  }

  @action showLeaguePage() {
    ga.pageview()
    this.currentView = {
      name: 'league',
      fixtures: fromPromise(this.http.getAllFixtures(hostUrl + 'api/fixtures', this.accessToken))
    }
  }

  @action showFixturePage(fixtureId) {
    ga.pageview()
    this.currentView = {
      name: 'fixture',
      fixtureId,
      fixture: fromPromise(this.http.getSingleFixture(hostUrl + 'api/fixtures/' + fixtureId, this.accessToken))
    }
  }

  @action showTransfersPage() {
    ga.pageview()
    this.currentView = {
      name: 'transfers',
      players: fromPromise(this.http.genericFetch(hostUrl + 'api/players', this.accessToken))
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

  @action setTrainingRegimen = (selectedOption) => {
    ga.event('Training Regimen', 'clicked')
    axios({
      method: 'PUT',
      url: hostUrl + 'api/players/' + this.currentUser.createdAsUid,
      params: {
        access_token: this.accessToken,
        regimen: selectedOption
      }
    }).then(response => {
      toast.success("Training Regimen updated!", {
        position: toast.POSITION.TOP_CENTER
      })
      this.setUser(response.data)
    }).catch((error) => {
      toast.error("SCHEISSE! Unable to update Training Regimen :(", {
        position: toast.POSITION.TOP_CENTER
      })
    })
  }

  @action createContract = (newContract) => {
    ga.event('Contract Saved', 'form saved')
    return axios({
      method: 'POST',
      url: hostUrl + 'api/contracts',
      params: {
        access_token: this.accessToken,
      },
      data: newContract
    }).then(() => {
      this.showOfficePage()
    })
  }

  @action acceptContract = (contractUid) => {
    ga.event('Contract Accepted')
    return axios({
      method: 'PUT',
      url: hostUrl + 'api/contracts/' + contractUid,
      params: {
        access_token: this.accessToken,
        status: 'accepted'
      }
    }).then(() => {
      this.showOfficePage()
    })
  }

  @action rejectContract = (contractUid) => {
    ga.event('Contract Rejected')
    return axios({
      method: 'PUT',
      url: hostUrl + 'api/contracts/' + contractUid,
      params: {
        access_token: this.accessToken,
        status: 'rejected'
      }
    })
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
  @action fulfillTopBarView = () => {
    this.topBarView.currentUserTeam.state = 'fulfilled'
  }

  @action setUserProfile = () => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: hostUrl + 'api/profile',
        params: {
          access_token: this.accessToken
        }
      }).then(response => {
        this.setUser(response.data)
        ga.init(this.currentUser.createdAsUid)
        if (response.data.teamUid) {
          this.showUserTeam(response.data.teamUid)
        } else {
          this.fulfillTopBarView()
        }
        resolve(response.data)
      }).catch(reject)
    })
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