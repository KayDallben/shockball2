//third party
import axios from 'axios'
import qs from 'qs'
if (!process.env.FIREBASE_DATABASE_URL) {
  const serviceAccount = require('../../firebase-security.json') //eslint-disable-line no-unused-vars
}
if (!process.env.SWC_CLIENT_SECRET) {
  const swcSecurity = require('../../swc-security.json')
  process.env.SWC_CLIENT_SECRET = swcSecurity.swc_client_secret
  process.env.SWC_CLIENT_ID = swcSecurity.swc_client_id
  process.env.SWC_REDIRECT_URI = swcSecurity.swc_redirect_uri
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

function getAccessToken(authCode) {
  return axios({
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
  }).then(response => {
    console.log('=========================RESPONSE IS========================') //eslint-disable-line no-console
    console.log(response) //eslint-disable-line no-console
    return response
  }).catch(error => {
    console.log('**********************ERROR IS***********************************') //eslint-disable-line no-console
    console.log(error) //eslint-disable-line no-console
    const swcError = new Error(error.message)
    return swcError
  })
}

export {
  getPlayerUid,
  getAccessToken
}