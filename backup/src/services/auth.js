const hostUrl = window.location.protocol + "//" + window.location.host + "/"

export default class Auth {
  constructor($http, $q) {
    this.currentUser = null
    this.$http = $http
    this.$q = $q
  }

  swcLogin() {
    window.location.href = "http://www.swcombine.com/ws/oauth2/auth/?response_type=code&client_id=ac3e2848095aa5cb82f91f7fc7ac7ad53b5a51a1&scope=CHARACTER_READ&redirect_uri=" + hostUrl + "authorize/index.html&state=auth&access_type=offline"
  }

  getUserInfo() {
    if (this.currentUser !== null) {
      return this.$q.when(this.currentUser)
    } else {
      return this.fetchUserInfo()
    }
  }

  fetchUserInfo() {
    const that = this;
    return this.$http({
        method: 'GET',
        url: './api/profile',
        params: {
          access_token: sessionStorage.getItem('swcAccessToken')
        }
      }).then(function(results) {
        that.currentUser = results;
        return results
      }).catch(function(error) {
        return error
      })
}

  sendToLogin() {
    window.location.href = hostUrl + 'authorize/index.html'
  }

  hasToken() {
    var existingAccessToken = sessionStorage.getItem("swcAccessToken");
    return existingAccessToken ? true : false
  }

  hasAuthCode() {
    var existingAuthCode = sessionStorage.getItem("swcAuthorizationCode");
    return existingAuthCode ? true : false
  }

  static get $inject() {
    return ['$http', '$q'];
  }
}