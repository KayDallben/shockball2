//third party
import axios from 'axios'
import qs from 'qs'

if (!process.env.FIREBASE_DATABASE_URL) {
  const serviceAccount = require('../../../dev-firebase-security.json') //eslint-disable-line no-unused-vars
}

if (!process.env.SWC_CLIENT_SECRET) {
  const swcSecurity = require('../../../dev-swc-security.json')
  process.env.SWC_CLIENT_SECRET = swcSecurity.SWC_CLIENT_SECRET
  process.env.SWC_CLIENT_ID = swcSecurity.SWC_CLIENT_ID
  process.env.SWC_REDIRECT_URI = swcSecurity.SWC_REDIRECT_URI
}

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

function refreshAccessToken(refreshToken) {
  const request = {
    url: 'http://www.swcombine.com/ws/oauth2/token/',
    method: 'POST',
    data: qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.SWC_CLIENT_ID,
      client_secret: process.env.SWC_CLIENT_SECRET
    }),
    headers: {
      'Accept': 'application/json'
    }
  }
  return axios(request).then(response => {
    return response
  }).catch(error => {
    const swcError = new Error(error.message)
    return swcError
  })
}

function getAccessToken(authCode) {
  const request = {
    url: 'http://www.swcombine.com/ws/oauth2/token/',
    method: 'POST',
    data: qs.stringify({
      code: authCode,
      client_id: process.env.SWC_CLIENT_ID,
      client_secret: process.env.SWC_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.SWC_REDIRECT_URI,
      access_type: 'offline'
    }),
    headers: {
      'Accept': 'application/json'
    }
  }
  return axios(request).then(response => {
    return response
  }).catch(error => {
    const swcError = new Error(error.message)
    return swcError
  })
}

export {
  getPlayerUid,
  refreshAccessToken,
  getAccessToken
}