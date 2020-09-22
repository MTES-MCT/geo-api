import 'dotenv/config'
import * as express from 'express'
import * as expressBasicAuth from 'express-basic-auth'
import * as bodyParser from 'body-parser'
import * as slowDown from 'express-slow-down'
import * as morgan from 'morgan'
import 'express-async-errors'

import { port, url } from './config'
import { communesFind, foretsFind } from './rbush-tree'
import { NextFunction, Request, Response } from 'express'

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
    expressBasicAuth({
      users: { [process.env.BASIC_USER]: process.env.BASIC_PASSWORD }
    })
  )
}

app.post('/', ({ body, query }, res, next) => {
  let elements: string[]
  if (!query || !query.elements) {
    next({
      message:
        'Veuillez renseigner le ou les types d’éléments souhaités (communes et/ou forets) sous la forme https://...?elements=communes,forets',
      status: 400
    })
  } else {
    try {
      elements = (query.elements as string).split(',')

      res.send(
        elements.reduce<any>((acc, element) => {
          let areas
          switch (element) {
            case 'communes':
              areas = communesFind(body)
              break
            case 'forets':
              areas = foretsFind(body)
              break
            default:
              next({
                message: `L’élément "${element}" est inconnu`,
                status: 400
              })

              return
          }
          acc[element] = areas

          return acc
        }, {})
      )
    } catch (err) {
      err.body = body
      next(err)
    }
  }
})

app.use(
  (
    err: { status: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err)
    res.status(err.status || 500).json({ error: err.message })
  }
)

app.listen(port, () => {
  console.log(' ')
  console.log('> Env: ', process.env.NODE_ENV)
  console.log('> Url: ', url)
  console.log(' ')
})
