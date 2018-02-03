//third party
import axios from 'axios'
import qs from 'qs'
// import serializeError from 'serialize-error'

//internal
import logger from './logger'

function getPlayerUid(token) {
  return axios.get('http://www.swcombine.com/ws/v1.0/character/?access_token=' + token, {
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    return response
  }).catch(error => {
    const swcError = new Error(error.message)
    return swcError
  })
}

function getAccessToken(authCode) {
  return axios({
    url: 'http://www.swcombine.com/ws/oauth2/token/',
    method: 'POST',
    data: qs.stringify({
      code: authCode,
      client_id: 'ac3e2848095aa5cb82f91f7fc7ac7ad53b5a51a1',
      client_secret: '1d8947cae3a26314a5eb9404138f30f8526cf63d',
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:8080/authServer/index.html',
      access_type: 'offline'
    }),
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    return response
  }).catch(error => {
    const swcError = new Error(error.message)
    return swcError
  })
}

export {
  getPlayerUid,
  getAccessToken
}