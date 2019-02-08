const intersect = require('@turf/intersect').default

const communes = require('./sources/communes-100m.geojson').features
const departements = require('./sources/departements-100m.geojson').features
const regions = require('./sources/regions-100m.geojson').features

departements.forEach(d => {
  d.properties.communes = communes.filter(
    c => c.properties.departement === d.properties.code
  )
})

regions.forEach(r => {
  r.properties.departements = departements.filter(
    d => d.properties.region === r.properties.code
  )
})

function findCommunes(titre) {
  const region = regions.find(polygon => intersect(titre, polygon))
  if (!region) return []

  const departement = region.properties.departements.find(polygon =>
    intersect(titre, polygon)
  )
  if (!departement) return []

  const items = departement.properties.communes.filter(polygon =>
    intersect(titre, polygon)
  )

  return items || []
}

module.exports = findCommunes
