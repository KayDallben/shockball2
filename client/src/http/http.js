import axios from 'axios'
import moment from 'moment'

const hostUrl = window.location.protocol + "//" + window.location.host + "/"
let tokenExpiresAt = new Date(window.sessionStorage.getItem('swcAccessTokenExpiresAt'))

function ensureFreshToken(token) {
    const isFresh = new Promise((resolve, reject) => {
        const now = new Date()
        if (now < tokenExpiresAt) {
            resolve(token)
        } else {
            axios({
                method: 'GET',
                url: hostUrl + 'api/refresh',
                params: {
                    access_token: token
                }
            }).then(response => {
                window.sessionStorage.setItem('swcAccessToken', response.data.access_token)
                window.sessionStorage.setItem('swcAccessTokenExpiresAt', response.data.expires_at)
                tokenExpiresAt = new Date(response.data.expires_at)
                resolve(response.data.access_token)
            }).catch(error => {
                reject(error)
            })
        }
    })
    return isFresh
}

function genericFetch(url, token) {
    return ensureFreshToken(token).then((currentToken) => {
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
    }).catch(error => {
        console.log('error with refresh token call')
        console.log(error)
    })
}

function getTeam(teamUid, token) {
    return axios({
        method: 'GET',
        url: hostUrl + 'api/teams/' + teamUid,
        params: {
            access_token: token
        }
    })
}

function getTeamPlayers(teamUid) {
    return axios({
        method: 'GET',
        url: hostUrl + 'api/players',
        params: {
            queryProp: 'teamUid',
            queryVal: teamUid
        }
    })
}

function getTeamEvents(teamUid) {
    return axios({
        method: 'GET',
        url: hostUrl + 'api/events',
        params: {
            queryProp: 'teamUid',
            queryVal: teamUid
        }
    })
}

function getTeamHomeFixtures(teamUid) {
    return axios({
        method: 'GET',
        url: hostUrl + 'api/fixtures',
        params: {
            queryProp: 'homeTeam',
            queryVal: teamUid
        }
    })
}

function getTeamAwayFixtures(teamUid) {
    return axios({
        method: 'GET',
        url: hostUrl + 'api/fixtures',
        params: {
            queryProp: 'awayTeam',
            queryVal: teamUid
        }
    })
}

function fetchShockballSquad(teamUid, token) {
    return ensureFreshToken(token).then((currentToken) => {
        return new Promise((resolve, reject) => {
            let squadModel = {}
            axios.all([getTeam(teamUid, token), getTeamPlayers(teamUid), getTeamEvents(teamUid), getTeamHomeFixtures(teamUid), getTeamAwayFixtures(teamUid)]).then(axios.spread(function (team, teamPlayers, teamEvents, teamHomeFixtures, teamAwayFixtures) {
                squadModel = {
                    teamInfo: team.data,
                    teamPlayers: teamPlayers.data,
                    teamEvents: teamEvents.data,
                    teamFixtures: teamHomeFixtures.data.concat(teamAwayFixtures.data)
                }
                resolve(squadModel)
            }))
        })
    }).catch(error => {
        console.log('error with refresh token call')
        console.log(error)
    })
}

function fetchShockballAdmin(uid, token) {
    return ensureFreshToken(token).then((currentToken) => {
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
    }).catch(error => {
        console.log('error with refresh token call')
        console.log(error)
    })
}
function fetchTeamAdmin(uid, token) {
    return ensureFreshToken(token).then((currentToken) => {
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
                if (teamOffice.account && !teamOffice.account.transactions) {
                    teamOffice.account.transactions = []
                } else {
                    teamOffice.account.transactions.sort(function(a, b) {
                        a = new Date(a.timestamp);
                        b = new Date(b.timestamp);
                        return a>b ? -1 : a<b ? 1 : 0;
                    })
                }
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
                }).catch((error) => {
                    reject(error)
                  })
              }).catch((error) => {
                reject(error)
              })
        })
    }).catch(error => {
        console.log('error with refresh token call')
        console.log(error)
    })
}

function fetchPlayerAdmin(uid, token) {
    return ensureFreshToken(token).then((currentToken) => {
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
    }).catch(error => {
        console.log('error with refresh token call')
        console.log(error)
    })
}

function getSingleFixture(url, token) {
    return ensureFreshToken(token).then((currentToken) => {
        return new Promise((resolve,reject) => {
            axios({
                method: 'GET',
                url: url,
                params: {
                    access_token: currentToken
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
    }).catch((error) => {
        console.log('error with refresh token call')
        console.log(error)
    })
}

function getAllFixtures(url, token) {
    return ensureFreshToken(token).then((currentToken) => {
        return new Promise((resolve,reject) => {
            axios({
                method: 'GET',
                url: url,
                params: {
                  queryProp: 'season',
                  queryVal: '1',
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
    }).catch(error => {
        console.log('error with refresh token call')
        console.log(error)
    })
}

function getUserTeam(url, token) {
    return ensureFreshToken(token).then((currentToken) => {
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
    }).catch(error => {
        console.log('error with refresh token call')
        console.log(error)
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
    ensureFreshToken,
    genericFetch,
    fetchShockballAdmin,
    fetchShockballSquad,
    fetchTeamAdmin,
    fetchPlayerAdmin,
    getSingleFixture,
    getAllFixtures,
    getUserTeam
}