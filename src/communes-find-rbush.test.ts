import { communesFind } from './communes-find-rbush'
import rbush from 'geojson-rbush'
import * as fs from 'fs'

describe('communesFind', () => {
  test('à partir de coordonnées retourne la liste des communes avec leur surface', () => {
    const tree = rbush()

    const sourceCommunes = JSON.parse(
      fs.readFileSync('./tests/communes.geojson').toString()
    ).features

    sourceCommunes.forEach((c: any) => tree.insert(c))

    expect(
      communesFind(
        {
          type: 'Feature',
          properties: { etapeId: 'm-axm-auror-2018-oct01-dex01' },
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [-54.0950602907814, 5.20885569954379],
                  [-54.1130169578246, 5.21036597243676],
                  [-54.1134002694189, 5.20586546870085],
                  [-54.0954347319799, 5.20435517507967],
                  [-54.0950602907814, 5.20885569954379]
                ]
              ]
            ]
          }
        },
        tree
      )
    ).toEqual([
      {
        properties: {
          code: '97311',
          departement: '973',
          nom: 'Saint-Laurent-du-Maroni',
          region: '03',
          surface: 1004627
        }
      }
    ])
  })
})
