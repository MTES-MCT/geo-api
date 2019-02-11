require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const { port, url } = require('./config/index')

const communesFind = require('./communes-find')

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

    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log(' ')
  console.log('> Url: ', url)
  console.log(' ')
})
