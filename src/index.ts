import 'dotenv/config'
import * as express from 'express'

import { port, url } from './config/index'

require('express-async-errors')

const basicAuth = require('express-basic-auth')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const slowDown = require('express-slow-down')

// Recherche naïve de comparaison itérative
// const communesFind = require('./communes-find-intersect')

// Recherche utilisant un index basé sur les bbox
const communesFind = require('./communes-find-rbush')
const tree = require('./rbush-tree')

const app = express()

app.enable('trust proxy')

const speedLimiter = slowDown({
  windowMs: 1000,
  delayAfter: 50,
  delayMs: 100
})

app.use(speedLimiter)

app.use(morgan('dev'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Géo communes API | https://github.com/MTES-MCT/geo-communes-api')
})

if (process.env.BASIC_USER && process.env.BASIC_PASSWORD) {
  app.use(
    basicAuth({
      users: { [process.env.BASIC_USER]: process.env.BASIC_PASSWORD }
    })
  )
}

app.post('/', ({ body }, res, next) => {
  try {
    const communes = communesFind(body, tree)

    res.send(communes)
  } catch (err) {
    err.body = body

    next(err)
  }
})

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err)

  // if (err.body) {
  //   console.error(JSON.stringify(err.body))
  // }

  res.status(err.status || 500).json({ error: err.message })
})

app.listen(port, () => {
  console.log(' ')
  console.log('> Env: ', process.env.NODE_ENV)
  console.log('> Url: ', url)
  console.log(' ')
})
