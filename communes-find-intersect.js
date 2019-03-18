const intersect = require('@turf/intersect').default

console.info('chargement des datasets...')

const sourceCommunes = require('./sources/communes-100m.geojson').features
const sourceDepartements = require('./sources/departements-100m.geojson')
  .features
const sourceRegions = require('./sources/regions-100m.geojson').features

console.info('pré-calcul des communes en fonction des départements et régions')

sourceDepartements.forEach(d => {
  d.properties.communes = sourceCommunes.filter(
    c => c.properties.departement === d.properties.code
  )
})

sourceRegions.forEach(r => {
  r.properties.departements = sourceDepartements.filter(
    d => d.properties.region === r.properties.code
  )
})

console.info('prêt')

// Version naïve (et peu optimisée) de la recherche de communes
function communesFind(geojson) {
  // Parcours chaque région et compare le périmêtre
  const regions = sourceRegions.filter(region => intersect(geojson, region))
  if (!regions.length) return []

  // Parcours les départements des régions filtrées et compare le périmètre
  const departements = regions.reduce(
    (departements, region) => [
      ...departements,
      ...region.properties.departements.filter(departement =>
        intersect(geojson, departement)
      )
    ],
    []
  )
  if (!departements.length) return []

  // Parcours les communes des départements filtrés et compare le périmètre
  const communes = departements.reduce(
    (communes, departement) => [
      ...communes,
      ...departement.properties.communes.filter(commune =>
        intersect(geojson, commune)
      )
    ],
    []
  )

  return communes
}

module.exports = communesFind
