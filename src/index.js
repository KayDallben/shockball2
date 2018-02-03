// 3rd party packages
import * as babelPolyfill from 'babel-polyfill'
import http from 'http'
import logger from './lib/logger'

// Internal packages/libraries
import app from './app'

// create http server
app.server = http.createServer(app)

app.use(function(req, res){
  logger.error('404 page requested')
  res.status(404).send('This page does not exist!')
})

// start the server
app.server.listen(process.env.PORT || '8080', () => {
  logger.info(`Server listening on http://localhost:${app.server.address().port}`) //eslint-disable-line no-console
})
