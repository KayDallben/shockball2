//third party
// import axios from 'axios'
// import serializeError from 'serialize-error'

//internal
// import logger from './logger'

// function validateToken(token) {
//   return axios.get('http://www.swcombine.com/ws/oauth2/tokeninfo', {
//     params: {
//       access_token: token
//     },
//     headers: {
//       'Accept': 'application/json'
//     }
//   }).then(response => {
//     return response
//   }).catch(error => {
//     const swcError = new Error(error.message)
//     return swcError
//   })
// }

// export default async function isAuthenticated(req, res, next) {
//   const swcToken = req.header('Authorization')
//   //validate with swc token endpoint that this access token is legitimate
//   const validToken = await validateToken(swcToken)
//   if (swcToken) {
//     if (validToken instanceof Error) {
//       //we convert the Error to a json object for better readability.
//       const error = serializeError(validToken)
//       res.status(401).send(error)
//     } else {
//       res.uid = validToken.user_id
//       res.swcToken = swcToken
//       next()
//     }
//   } else {
//     logger.error('Authorization header not found')
//     res.status(401).send()
//   }
// }


export default function isAuthenticated(req, res, next) {
  const swcToken = req.header('Authorization')
  req.uid = '1:1305198'
  req.swcToken = swcToken
  next()
}