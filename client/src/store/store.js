import {
  observable,
  action,
  computed,
  useStrict
} from 'mobx'
import axios from 'axios'
import moment from 'moment'

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
  @observable fixtures = []
  @observable currentFixture = {
    events: [],
    fixtureInfo: {},
    matchStats: {}
  }
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
  @action setFixtures = (data) => {
    this.fixtures = data
  }
  @action setCurrentFixture = (data) => {
    this.currentFixture = data
  }
  @action getSingleFixture = (fixtureId) => {
    axios({
      method: 'GET',
      url: '../api/fixtures/' + fixtureId,
      params: {
        access_token: this.accessToken
      }
    }).then(response => {
      if (response.data) {
        let fixture = response.data
        fixture.gameDate = moment(fixture.gameDate).format('L')
        fixture.events.sort(function(a,b){
          return parseInt(a.recordGameTime) - parseInt(b.recordGameTime)
        })
        fixture.matchStats = this.createStats(fixture.events)
        this.setCurrentFixture(fixture)
      }
    })
  }
  @action handleFixtureData = () => {
    axios({
      method: 'GET',
      url: './api/fixtures',
      params: {
        access_token: this.accessToken
      }
    }).then(response => {
      if (response.data) {
        let fixtures = response.data
        for (let fixture of fixtures) {
          fixture.gameDate = moment(fixture.gameDate).format('L')
        }
        fixtures.sort(function(a,b){
          return new Date(a.gameDate) - new Date(b.gameDate);
        });
        this.setFixtures(fixtures)
      }
    })
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
  
  createStats(events) {
    var firstTeam = events[0].teamName
    let secondTeam = ''
    for (let event of events) {
      if (event.teamName !== firstTeam) {
        secondTeam = event.teamName
      }
    }
    const stats = {
      [firstTeam]: {
        totalShots: events.filter((obj) => obj.recordType === 'shoots' && obj.teamName === firstTeam).length,
        totalPasses: events.filter((obj) => obj.recordType === 'passes ball' && obj.teamName === firstTeam).length,
        totalGoals: events.filter((obj) => obj.recordType === 'goal' && obj.teamName === firstTeam).length,
        totalGoalsBlocked: events.filter((obj) => obj.recordType === 'goal blocked' && obj.teamName === firstTeam).length,
        totalPassesBlocked: events.filter((obj) => obj.recordType === 'pass blocked' && obj.teamName === firstTeam).length,
        totalRuns: events.filter((obj) => obj.recordType === 'runs ball' && obj.teamName === firstTeam).length,
        totalBallTackles: events.filter((obj) => obj.recordType === 'tackles ball' && obj.teamName === firstTeam).length,
        totalTackles: events.filter((obj) => obj.recordType === 'tackles' && obj.teamName === firstTeam).length
      },
      [secondTeam]: {
        totalShots: events.filter((obj) => obj.recordType === 'shoots' && obj.teamName === secondTeam).length,
        totalPasses: events.filter((obj) => obj.recordType === 'passes ball' && obj.teamName === secondTeam).length,
        totalGoals: events.filter((obj) => obj.recordType === 'goal' && obj.teamName === secondTeam).length,
        totalGoalsBlocked: events.filter((obj) => obj.recordType === 'goal blocked' && obj.teamName === secondTeam).length,
        totalPassesBlocked: events.filter((obj) => obj.recordType === 'pass blocked' && obj.teamName === secondTeam).length,
        totalRuns: events.filter((obj) => obj.recordType === 'runs ball' && obj.teamName === secondTeam).length,
        totalBallTackles: events.filter((obj) => obj.recordType === 'tackles ball' && obj.teamName === secondTeam).length,
        totalTackles: events.filter((obj) => obj.recordType === 'tackles' && obj.teamName === secondTeam).length
      }
    }
    return stats
  }

}

export default Store;