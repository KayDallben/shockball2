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
        icon: 'fas fa-user',
        routeMethod: this.showPlayerPage.bind(this)
      },
      {
        title: 'Squad',
        icon: 'fas fa-users',
        routeMethod: this.showSquadPage.bind(this)
      },
      {
        title: 'Office',
        icon: 'fas fa-briefcase',
        routeMethod: this.showOfficePage.bind(this)
      },
      {
        title: 'League',
        icon: 'fas fa-flag',
        routeMethod: this.showLeaguePage.bind(this)
      },
      {
        title: 'Transfers',
        icon: 'fas fa-building',
        routeMethod: this.showTransfersPage.bind(this)
      }
    ]
  }

  @computed get accessToken() {
    return sessionStorage.getItem('swcAccessToken')
  }

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
      player: fromPromise(this.http.genericFetch(hostUrl + 'api/players/' + this.currentUser.shockballPlayerUid, this.accessToken))
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
        office: fromPromise(this.http.fetchPlayerAdmin(this.currentUser.shockballPlayerUid, this.accessToken))
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
    } else if (!playerId && this.currentUser.shockballPlayerUid) {
      this.currentView = {
        name: 'player',
        playerId,
        player: fromPromise(this.http.genericFetch(hostUrl + 'api/players/' + this.currentUser.shockballPlayerUid, this.accessToken))
      }  
    } else if (!playerId && !this.currentUser.shockballPlayerUid) {
      this.currentView = {
        name: 'player',
        playerId,
        player: fromPromise(this.setUserProfile())
      }
    }
  }

  @action showAdminPage = () => {
    this.currentView = {
      name: 'admin',
      adminModel: fromPromise(this.http.fetchShockballAdmin(this.currentUser.shockballPlayerUid, this.accessToken))
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
    if (squadId) {
      // player went to another Team's squad page
      this.currentView = {
        name: 'squad',
        squadId,
        squad: fromPromise(this.http.fetchShockballSquad(squadId, this.accessToken))
      }  
    } else if (!squadId && this.currentUser.teamUid) {
      // player went to own squad
      this.currentView = {
        name: 'squad',
        squad: fromPromise(this.http.fetchShockballSquad(this.currentUser.teamUid, this.accessToken))
      }  
    } else if (!squadId && !this.currentUser.teamUid) {
      // player went to own squad page but is a free agent
      this.currentView = {
        name: 'squad',
        squad: fromPromise(Promise.resolve({ teamInfo: {}, teamPlayers: [], teamEvents: [], teamFixtures: []}))
      }
    }
  }

  @action showLeaguePage() {
    ga.pageview()
    this.currentView = {
      name: 'league',
      leagueModel: fromPromise(this.http.getLeagueInfo(this.accessToken))
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
        case "admin": return `/admin`
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

  @action changePlayerLineupPosition = (originalPlayer, newPlayer) => {
    ga.event('Lineup Change', 'clicked')
    return this.http.ensureFreshToken(this.accessToken).then((currentToken) => {
      if (!originalPlayer.shockballPlayerUid) {
        //is a BOT so no need to write back to originalPlayer
        this.updateNewPlayerSwitch(originalPlayer, newPlayer)
      } else {
        this.updateOriginalAndNewPlayerSwitch(originalPlayer, newPlayer)
      }
    }).catch(error => {
        console.log('error getting refresh token')
        console.log(error)
    })
  }

  @action setTrainingRegimen = (selectedOption) => {
    ga.event('Training Regimen', 'clicked')
    return this.http.ensureFreshToken(this.accessToken).then((currentToken) => {
      axios({
        method: 'PUT',
        url: hostUrl + 'api/players/' + this.currentUser.shockballPlayerUid,
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
    }).catch(error => {
        console.log('error getting refresh token')
        console.log(error)
    })
  }

  @action createContract = (newContract) => {
    ga.event('Contract Saved', 'form saved')
    return this.http.ensureFreshToken(this.accessToken).then((currentToken) => {
      return axios({
        method: 'POST',
        url: hostUrl + 'api/contracts',
        params: {
          access_token: this.accessToken,
        },
        data: newContract
      }).then((response) => {
        this.showOfficePage()
      })
    }).catch(error => {
        console.log('error getting refresh token')
        console.log(error)
    })
  }

  @action deleteContract = (contractUid, viewRefresh) => {
    ga.event('Contract Deleted')
    return this.http.ensureFreshToken(this.accessToken).then((currentToken) => {
      return axios({
        method: 'DELETE',
        url: hostUrl + 'api/contracts/' + contractUid,
        params: {
          access_token: this.accessToken,
          swcUid: this.currentUser.swcPlayerUid
        }
      }).then(() => {
        if (viewRefresh === 'office') {
          this.showOfficePage()
        } else if (viewRefresh === 'admin') {
          this.showAdminPage()
        }
      })
    }).catch(error => {
        console.log('error getting refresh token')
        console.log(error)
    })
  }

  @action updateContractState = (contractUid, state, viewRefresh, isFeePaid) => {
    ga.event('Contract ' + state)
    let params = {
      access_token: this.accessToken,
      status: state
    }
    if (isFeePaid) {
      params = Object.assign(params, { isFeePaid: true })
    }
    return this.http.ensureFreshToken(this.accessToken).then((currentToken) => {
      return axios({
        method: 'PUT',
        url: hostUrl + 'api/contracts/' + contractUid,
        params: params
      }).then(() => {
        if (viewRefresh === 'office') {
          this.showOfficePage()
        } else if (viewRefresh === 'admin') {
          this.showAdminPage()
        }
      })
    }).catch(error => {
        console.log('error getting refresh token')
        console.log(error)
    })
  }

  @action performSwcLogin = () => {
    const clientId = window.location.host.indexOf('localhost') > -1 || window.location.host.indexOf('c9users') > -1 ? 'e5c1500bf34c3cec3761f3049cbc947e1299c7d8' : 'ac3e2848095aa5cb82f91f7fc7ac7ad53b5a51a1'
    console.log('client id is ' + clientId)
    window.location.href = "http://www.swcombine.com/ws/oauth2/auth/?response_type=code&client_id=" + clientId + "&scope=CHARACTER_READ&redirect_uri=" + hostUrl + "authorize/index.html&state=auth&access_type=offline"
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
      return this.http.ensureFreshToken(this.accessToken).then((currentToken) => {
        axios({
          method: 'GET',
          url: hostUrl + 'api/profile',
          params: {
            access_token: this.accessToken
          }
        }).then(response => {
          this.setUser(response.data)
          ga.init(this.currentUser.shockballPlayerUid)
          if (response.data.teamUid) {
            this.showUserTeam(response.data.teamUid)
          } else {
            this.fulfillTopBarView()
          }
          resolve(response.data)
        }).catch(reject)
      }).catch(error => {
          console.log('error getting refresh token')
          console.log(error)
      })
    })
  }
  @action handleUserSetup = () => {
    if (!this.hasAccessToken) {
      this.sendToLoginPage()
    }
  }

  updateNewPlayerSwitch(originalPlayer, newPlayer) {
    return axios({
      method: 'PUT',
      url: hostUrl + 'api/players/' + newPlayer.shockballPlayerUid,
      params: {
        access_token: this.accessToken,
        lineupPosition: originalPlayer.lineupPosition
      }
    }).then(response => {
      toast.success("Player lineup position updated!", {
        position: toast.POSITION.TOP_CENTER
      })
      this.showSquadPage(this.currentUser.teamManager)
      this.closeModal()
    }).catch(error => {
      toast.error("SCHEISSE! Unable to update player lineup position :(", {
        position: toast.POSITION.TOP_CENTER
      })
      this.closeModal()
    }) 
  }

  updateOriginalAndNewPlayerSwitch(originalPlayer, newPlayer) {
    return axios({
      method: 'PUT',
      url: hostUrl + 'api/players/' + originalPlayer.shockballPlayerUid,
      params: {
        access_token: this.accessToken,
        lineupPosition: 'null' //axios doesn't convert actual null to a param, so passing string null here and handling on api side
      }
    }).then(response => {
      this.updateNewPlayerSwitch(originalPlayer, newPlayer)
    }).catch((error) => {
      console.log(error);
      toast.error("SCHEISSE! Unable to update player lineup position :(", {
        position: toast.POSITION.TOP_CENTER
      })
      this.closeModal()
    })
  }

}

export default Store;