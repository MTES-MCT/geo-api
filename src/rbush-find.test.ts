import { communesGeojson } from './__mocks__/communes-geojson'
import { communesFind } from './rbush-tree'

jest.mock('fs', () => {
  return {
    readFileSync: () => JSON.stringify(communesGeojson)
  }
})

describe('communesFind', () => {
  test('à partir de coordonnées retourne la liste des communes avec leur surface', () => {
    expect(
      communesFind({
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
      })
    ).toEqual([
      {
        code: '97311',
        departement: '973',
        nom: 'Saint-Laurent-du-Maroni',
        region: '03',
        surface: 1004627
      }
    ])
  })
})
