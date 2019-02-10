const intersect = require('@turf/intersect').default

const sourceCommunes = require('./sources/communes-100m.geojson').features
const sourceDepartements = require('./sources/departements-100m.geojson')
  .features
const sourceRegions = require('./sources/regions-100m.geojson').features

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

function communesFind(geojson) {
  const regions = sourceRegions.filter(polygon => intersect(geojson, polygon))
  if (!regions) return []

  const departements = regions.reduce(
    (departements, region) => [
      ...departements,
      ...region.properties.departements.filter(polygon =>
        intersect(geojson, polygon)
      )
    ],
    []
  )
  if (!departements) return []

  const communes = departements.reduce(
    (communes, departement) => [
      ...communes,
      ...departement.properties.communes.filter(polygon =>
        intersect(geojson, polygon)
      )
    ],
    []
  )

  return communes || []
}

module.exports = communesFind
