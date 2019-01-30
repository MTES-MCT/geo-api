require('dotenv').config()

const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')

const { port, url } = require('./config/index')

const findCommunes = require('./find-communes')

const app = express()

app.use(bodyParser.json())

app.post('/', (req, res) => {
  const { body } = req

  const communes = findCommunes(body)

  res.send({
    communes,
    body,
  })
})

app.listen(port, () => {
  console.log(' ')
  console.log(chalk.bgWhiteBright.black.bold('> Url: ' + url + ' '))
  console.log(chalk.bgWhiteBright.black.bold('> ENV: ' + process.env.ENV + ' '))
  console.log(
    chalk.bgWhiteBright.black.bold('> NODE_ENV: ' + process.env.NODE_ENV + ' ')
  )
  console.log(' ')
})
