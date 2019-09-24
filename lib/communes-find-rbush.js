const intersect = require('@turf/intersect').default

function communesFind(geojsonMultiPolygon, tree) {
  if (!geojsonMultiPolygon.properties) {
    geojsonMultiPolygon.properties = {}
  }

  try {
    // Recherche le périmètre dans l'index bbox
    const { features: matchingCommunes } = tree.search(geojsonMultiPolygon)

    // const geojsonPolygons = geojsonMultiPolygon.geometry.coordinates.map(
    //   coordinates => ({
    //     type: 'Feature',
    //     properties: geojsonMultiPolygon.properties,
    //     geometry: {
    //       type: 'Polygon',
    //       coordinates
    //     }
    //   })
    // )

    // Filtre les communes trouvées par l'index et compare le périmètre
    const communes = matchingCommunes.filter(commune =>
      // geojsonPolygons.some(geojsonPolygon => intersect(geojsonPolygon, commune))
      intersect(geojsonMultiPolygon, commune)
    )

    return communes.map(({ properties }) => ({ properties }))
  } catch (e) {
    e.status = 400
    throw e
  }
}

module.exports = communesFind
