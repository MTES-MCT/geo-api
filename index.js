require('dotenv').config()

const express = require('express')
require('express-async-errors')

const bodyParser = require('body-parser')
const morgan = require('morgan')

const { port, url } = require('./lib/config')

// Recherche naïve de comparaison itérative
// const communesFind = require('./communes-find-intersect')

// Recherche utilisant un index basé sur les bbox
const communesFind = require('./lib/communes-find-rbush')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Géo communes API | https://github.com/MTES-MCT/geo-communes-api')
})

app.post('/', ({ body }, res, next) => {
  try {
    const communes = communesFind(body)

    res.send(communes)
  } catch (err) {
    err.body = body

    next(err)
  }
})

app.use((err, req, res, next) => {
  console.error(err)

  if (err.body) {
    console.error(JSON.stringify(err.body))
  }

  res.status(err.status || 500).json({ error: err.message })
})

app.listen(port, () => {
  console.log(' ')
  console.log('> Env: ', process.env.NODE_ENV)
  console.log('> Url: ', url)
  console.log(' ')
})
