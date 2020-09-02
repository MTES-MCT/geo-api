const intersect = require('@turf/intersect').default
const area = require('@turf/area').default

function communesFind(geojsonMultiPolygon, tree) {
  if (!geojsonMultiPolygon.properties) {
    geojsonMultiPolygon.properties = {}
  }

  try {
    // Recherche le périmètre dans l'index bbox
    const { features: matchingCommunes = [] } = tree.search(geojsonMultiPolygon)

    // Filtre les communes trouvées par l'index et compare le périmètre
    return matchingCommunes.reduce((communes, commune) => {
      const intersected = intersect(geojsonMultiPolygon, commune)
      if (!intersected) return communes

      const { properties } = commune

      // calcule la surface couverte par le périmètre sur la commune
      properties.surface = Math.round(area(intersected))

      communes.push({ properties })

      return communes
    }, [])
  } catch (e) {
    e.status = 400
    throw e
  }
}

module.exports = communesFind
