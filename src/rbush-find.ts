import { Polygon, Properties, Feature, MultiPolygon } from '@turf/helpers'
import { RBush } from 'geojson-rbush'
import intersect from '@turf/intersect'
import area from '@turf/area'
import { IArea } from './types'

export const rbushFind = <I, O extends IArea>(
  geojsonMultiPolygon: Feature<Polygon | MultiPolygon>,
  tree: RBush<Polygon | MultiPolygon, Properties>,
  mapper: (input: I) => O
): { properties: O }[] => {
  if (!geojsonMultiPolygon.properties) {
    geojsonMultiPolygon.properties = {}
  }

  try {
    // Recherche le périmètre dans l'index bbox
    const { features: matchingCommunes = [] } = tree.search(geojsonMultiPolygon)

    // Filtre les éléments trouvés par l'index et compare le périmètre
    return matchingCommunes.reduce((communes: { properties: O }[], commune) => {
      const intersected = intersect(geojsonMultiPolygon, commune)
      if (!intersected) return communes

      const { properties } = commune

      if (!properties) {
        return communes
      }

      const result = mapper(properties as I)

      // calcule la surface couverte par le périmètre de l’élément
      result.surface = Math.round(area(intersected))

      communes.push({ properties: result })

      return communes
    }, [])
  } catch (e) {
    e.status = 400
    throw e
  }
}
