require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const { port, url } = require('./config/index')

// Recherche naïve de comparaison itérative
// const communesFind = require('./communes-find-intersect')

// Recherche utilisant un index basé sur les bbox
const communesFind = require('./communes-find-rbush')

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Géo communes API | https://github.com/MTES-MCT/geo-communes-api')
})

app.post('/', ({ body }, res) => {
  try {
    const communes = communesFind(body)

    res.send(communes)
  } catch (err) {
    console.error(err)
    console.error(JSON.stringify(body))

    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log(' ')
  console.log('> Url: ', url)
  console.log(' ')
})
