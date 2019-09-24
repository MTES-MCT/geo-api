const geojsonRbush = require('geojson-rbush').default
const tree = geojsonRbush()

console.info('Chargement des communes...')

const sourceCommunes = require('../sources/communes-100m.geojson').features

console.info("Insertion dans l'index")
sourceCommunes.forEach(c => tree.insert(c))

console.info('Prêt')

module.exports = tree
