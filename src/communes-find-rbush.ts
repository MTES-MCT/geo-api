import { Polygon, Properties, Feature, MultiPolygon } from '@turf/helpers'
import { RBush } from 'geojson-rbush'
import intersect from '@turf/intersect'
import area from '@turf/area'

export const communesFind = (
  geojsonMultiPolygon: Feature<Polygon | MultiPolygon>,
  tree: RBush<Polygon | MultiPolygon, Properties>
): { properties: Properties }[] => {
  if (!geojsonMultiPolygon.properties) {
    geojsonMultiPolygon.properties = {}
  }

  try {
    // Recherche le périmètre dans l'index bbox
    const { features: matchingCommunes = [] } = tree.search(geojsonMultiPolygon)

    // Filtre les communes trouvées par l'index et compare le périmètre
    return matchingCommunes.reduce(
      (communes: { properties: Properties }[], commune) => {
        const intersected = intersect(geojsonMultiPolygon, commune)
        if (!intersected) return communes

        let { properties } = commune

        if (!properties) {
          properties = {}
        }

        // calcule la surface couverte par le périmètre sur la commune
        properties.surface = Math.round(area(intersected))

        communes.push({ properties })

        return communes
      },
      []
    )
  } catch (e) {
    e.status = 400
    throw e
  }
}
