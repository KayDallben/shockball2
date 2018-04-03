import axios from 'axios'
import moment from 'moment'

const hostUrl = window.location.protocol + "//" + window.location.host + "/"

function genericFetch(url, token) {
    return new Promise((resolve,reject) => {
        axios({
            method: 'GET',
            url: url,
            params: {
              access_token: token
            }
          }).then(response => {
            resolve(response.data)
          }).catch(reject);
    })
}
function fetchShockballAdmin(uid, token) {
    return new Promise((resolve, reject) => {
        let adminModel = {}
        axios({
            method: 'GET',
            url: hostUrl + 'api/contracts',
            params: {
                queryProp: 'status',
                queryVal: 'accepted',
                access_token: token
            }
        }).then(response => {
            adminModel.contracts = response.data
            resolve(adminModel)
            // axios({
            //     method: 'GET',
            //     url: hostUrl + 'api/teams',
            //     params: {
            //         access_token: token
            //     }
            // }).then(response2 => {
            //     adminModel.teams = response2.data
            //     resolve(adminModel)
            // }).catch(reject)
        }).catch(reject)
    })
}
function fetchTeamAdmin(uid, token) {
    return new Promise((resolve, reject) => {
        let teamOffice = {}
        axios({
            method: 'GET',
            url: hostUrl + 'api/accounts/' + uid,
            params: {
              access_token: token
            }
          }).then((response) => {
            teamOffice.account = response.data
            teamOffice.account.transactions.sort(function(a, b) {
                a = new Date(a.timestamp);
                b = new Date(b.timestamp);
                return a>b ? -1 : a<b ? 1 : 0;
            })
            axios({
                method: 'GET',
                url: hostUrl + 'api/contracts',
                params: {
                  queryProp: 'teamUid',
                  queryVal: uid,
                  access_token: token
                }
            }).then((response2) => {
                teamOffice.contracts = response2.data
                resolve(teamOffice)
            }).catch(reject);
          }).catch(reject);
    })
}

function fetchPlayerAdmin(uid, token) {
    return new Promise((resolve, reject) => {
        let playerOffice = {}
        axios({
            method: 'GET',
            url: hostUrl + 'api/accounts/' + uid,
            params: {
              access_token: token
            }
          }).then((response) => {
            playerOffice.account = response.data
            axios({
                method: 'GET',
                url: hostUrl + 'api/contracts',
                params: {
                  queryProp: 'playerUid',
                  queryVal: uid,
                  access_token: token
                }
            }).then((response2) => {
                playerOffice.contracts = response2.data
                resolve(playerOffice)
            }).catch(reject);
          }).catch(reject);
    })
}

function getSingleFixture(url, token) {
    return new Promise((resolve,reject) => {
        axios({
            method: 'GET',
            url: url,
            params: {
                access_token: token
            }
        }).then(response => {
            if (response.data) {
                let fixture = response.data
                fixture.gameDate = moment(fixture.gameDate).format('L')
                fixture.events.sort(function(a,b){
                    return parseInt(a.recordGameTime) - parseInt(b.recordGameTime)
                })
                fixture.matchStats = createStats(fixture.events)
                resolve(fixture)
            } else {
                reject(response)
            }
        }).catch(reject)
    })
}

function getAllFixtures(url, token) {
    return new Promise((resolve,reject) => {
        axios({
            method: 'GET',
            url: url,
            params: {
              access_token: token
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
              resolve(fixtures)
            } else {
                reject(response)
            }
        }).catch(reject)
    })
}

function getUserTeam(url, token) {
    return new Promise((resolve,reject) => {
        axios({
            method: 'GET',
            url: url,
            params: {
              access_token: token
            }
          }).then(response => {
            resolve(response.data)
          }).catch(reject)
    })
}

function createStats(events) {
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

export default {
    genericFetch,
    fetchShockballAdmin,
    fetchTeamAdmin,
    fetchPlayerAdmin,
    getSingleFixture,
    getAllFixtures,
    getUserTeam
}