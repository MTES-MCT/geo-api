const intersect = require('@turf/intersect').default
const geojsonRbush = require('geojson-rbush').default
const tree = geojsonRbush()

console.info('Chargement des communes...')

const sourceCommunes = require('./sources/communes-100m.geojson').features

console.info("Insertion dans l'index")
sourceCommunes.forEach(c => tree.insert(c))

console.info('Prêt')

function communesFind(geojson) {
  if (!geojson.properties) {
    geojson.properties = {}
  }

  // Recherche le périmètre dans l'index bbox
  const { features: matchingCommunes } = tree.search(geojson)

  // Filtre les communes trouvées par l'index et compare le périmètre
  const communes = matchingCommunes.filter(commune =>
    intersect(geojson, commune)
  )

  return communes
}

module.exports = communesFind
