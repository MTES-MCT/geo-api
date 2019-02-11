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
  const regions = sourceRegions.filter(region => intersect(geojson, region))
  if (!regions) return []

  const departements = regions.reduce(
    (departements, region) => [
      ...departements,
      ...region.properties.departements.filter(departement =>
        intersect(geojson, departement)
      )
    ],
    []
  )
  if (!departements) return []

  const communes = departements.reduce(
    (communes, departement) => [
      ...communes,
      ...departement.properties.communes.filter(commune =>{
        return intersect(geojson, commune)}
      )
    ],
    []
  )

  return communes || []
}

module.exports = communesFind
