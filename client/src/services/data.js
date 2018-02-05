export default class DataService {
  constructor($http) {
    this.$http = $http;
  }

  // Example service function
  login(authCode) {
    return this.$http({
      method: 'GET',
      url: './api/login'
    })
  }

  static get $inject() {
    return ['$http'];
  }
}
