import turfIntersect from '@turf/intersect'
import turfArea from '@turf/area'
import { IArea, IGeojson, IRBushTree } from './types'

const rbushFind = <I, O extends IArea>(
  geojson: IGeojson,
  tree: IRBushTree,
  format?: (input: I) => O
) => {
  try {
    if (!geojson.properties) {
      geojson.properties = {}
    }
    // Recherche le périmètre dans l'index bbox
    const { features } = tree.search(geojson)

    // Filtre les éléments trouvés par l'index et compare le périmètre
    return features.reduce((areas: O[], feature) => {
      if (!feature.properties) return areas

      const intersection = turfIntersect(geojson, feature)

      if (!intersection) return areas

      const area = format
        ? format(feature.properties as I)
        : (feature.properties as O)

      // calcule la surface couverte par le périmètre de l’élément
      area.surface = Math.round(turfArea(intersection))

      areas.push(area)

      return areas
    }, [])
  } catch (e) {
    e.status = 400
    throw e
  }
}

export { rbushFind }
