// 3rd party packages
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import swaggerJSDoc from 'swagger-jsdoc'
import favicon from 'serve-favicon'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'

// our files/packages
import logger from './lib/logger'
import routes from './routes/routes'
import initializeDb from './db'

// create express application
let app = express()

// initialize morgan http logging
app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode < 400
  }, stream: process.stderr
}))

app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode >= 400
  }, stream: process.stdout
}))

// Enforce http body limit
app.use(bodyParser.json({
  limit : '100kb'
}))

// No view engine, serve public folder (index.html) instead
app.use(express.static(path.join(__dirname, '..', 'public')))

// use custom favicon
app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')))

// enabling gzip compression of responses: https://github.com/expressjs/compression
app.use(compression())

// http/https basic security: https://github.com/helmetjs/helmet
app.use(helmet())

// create swagger configuration: https://github.com/Surnet/swagger-jsdoc
const options = {
  swaggerDefinition: {
    info: {
      title: 'Shockball2', // Title (required)
      version: '0.1.0', // Version (required)
      description: 'Fantasy Sports Simulation for Star Wars Combine'
    },
    host: process.env.FIREBASE_DATABASE_URL ? 'shockball3.herokuapp.com' : 'localhost:8080',
    schemes: [
      'http'
    ],
    securityDefinitions: {
      'jwt': {
        'type': 'apiKey',
        'name': 'Authorization',
        'in': 'header'
      }
    },
    security: [{
      jwt: []
    }],
    basePath: '/'
  },
  apis: [
    './src/routes/routes.js'
  ]
}

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options)

// serve swagger
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// connect to db, and ensure it is up before we start our api
initializeDb(app, db => {
  app.use('/api', routes(db, logger))
})

export default app
