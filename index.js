require('dotenv').config()

const chalk = require('chalk')
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
  const communes = communesFind(body)

  res.send(communes)
})

app.listen(port, () => {
  console.log(' ')
  console.log(chalk.bgWhiteBright.black.bold('> Url: ' + url + ' '))
  console.log(' ')
})
