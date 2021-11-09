import * as fs from 'fs'
import geojsonRbush from 'geojson-rbush'
import { rbushFind } from './rbush-find'
import {
  ICommune,
  IForetInput,
  IForet,
  IGeojson,
  IRBushTree,
  ISDOMZone,
  ISDOMZoneInput
} from './types'

const treeLoad = (
  filePath: string,
  tree = geojsonRbush(),
  properties: {} | undefined = undefined
): IRBushTree => {
  const source = JSON.parse(fs.readFileSync(filePath).toString()).features

  source.forEach((c: IGeojson) => {
    if (properties) {
      c.properties = { ...c.properties, ...properties }
    }
    tree.insert(c)
  })

  return tree
}

const communesTreeGet = () => {
  console.info('Chargement des communes...')
  const tree = treeLoad('./sources/communes.geojson')
  console.info('Chargement des communes terminé.')

  return tree
}

const foretsTreeGet = () => {
  console.info('Chargement des forêts...')
  const tree = treeLoad('./sources/forets_onf_973.json')
  console.info('Chargement des forêts terminé.')

  return tree
}

const sdomZonesTreeGet = () => {
  console.info('Chargement du SDOM...')
  // Nous sommes obligés de mettre les ids manuellement et la zone de « Zone 0, potentielle »,
  // pour rendre les fichiers en entrée cohérents
  let tree = treeLoad('./sources/zone_0_s_973.json', geojsonRbush(), {
    id: '0'
  })
  tree = treeLoad('./sources/zone_0_potentielle_s_973.json', tree, {
    id: '0_potentielle',
    zone: 'ZONE 0, potentielle'
  })
  tree = treeLoad('./sources/zone_1_s_973.json', tree, {
    id: '1'
  })
  tree = treeLoad('./sources/zone_2_s_973.json', tree, {
    id: '2'
  })
  console.info('Chargement du SDOM terminé.')

  return tree
}

const communesTree = communesTreeGet()
const foretsTree = foretsTreeGet()
const sdomZonesTree = sdomZonesTreeGet()

const communesFind = (geojson: IGeojson) =>
  rbushFind<ICommune, ICommune>(geojson, communesTree)

const foretsFind = (geojson: IGeojson) =>
  rbushFind<IForetInput, IForet>(geojson, foretsTree, foret => ({
    nom: foret.foret,
    code: foret.code_for,
    perimetre: foret.perimeter
  }))

const sdomZonesFind = (geojson: IGeojson) =>
  rbushFind<ISDOMZoneInput, ISDOMZone>(geojson, sdomZonesTree, zone => ({
    nom: zone.zone,
    code: zone.id
  }))

export { communesFind, foretsFind, sdomZonesFind }
