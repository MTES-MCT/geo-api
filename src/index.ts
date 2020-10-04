import 'dotenv/config'
import * as express from 'express'
import * as expressBasicAuth from 'express-basic-auth'
import * as bodyParser from 'body-parser'
import * as slowDown from 'express-slow-down'
import * as morgan from 'morgan'
import 'express-async-errors'

import { port, url } from './config'
import { communesFind, foretsFind } from './rbush-tree'
import { Request, Response, NextFunction } from 'express'
import { IAreas, IAreasIndex, IAreaId, ICommune, IForet } from './types'

const ELEMENTS_INDEX = {
  communes: communesFind,
  forets: foretsFind
} as IAreasIndex

const ELEMENTS_IDS = Object.keys(ELEMENTS_INDEX) as IAreaId[]

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
  res.send('Géo communes API | https://github.com/MTES-MCT/geo-api')
})

if (process.env.BASIC_USER && process.env.BASIC_PASSWORD) {
  app.use(
    expressBasicAuth({
      users: { [process.env.BASIC_USER]: process.env.BASIC_PASSWORD }
    })
  )
}

app.post('/', ({ body: geojson, query }, res, next) => {
  try {
    let elementsIds = [] as IAreaId[]

    if (query?.elements) {
      const queryElementsIds = (query.elements as string).split(',')

      if (queryElementsIds.some(q => !(ELEMENTS_IDS as string[]).includes(q))) {
        next({
          message: `éléments possibles: ${ELEMENTS_IDS.join(', ')}`,
          status: 400
        })

        return
      }

      elementsIds = queryElementsIds as IAreaId[]
    } else {
      elementsIds = ELEMENTS_IDS.slice() as IAreaId[]
    }

    const areas = elementsIds.reduce((acc: IAreas, id) => {
      const areasFind = ELEMENTS_INDEX[id]
      acc[id] = areasFind(geojson) as ICommune[] & IForet[]

      return acc
    }, {})

    res.send(areas)
  } catch (err) {
    err.body = geojson
    next(err)
  }
})

app.use(
  (
    err: { status: number; message: string },
    req: Request,
    res: Response,
    // nécessaire pour express-async-errors
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
