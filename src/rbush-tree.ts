import * as fs from 'fs'
import geojsonRbush from 'geojson-rbush'
import { rbushFind } from './rbush-find'
import { ICommune, IForetInput, IForet, IGeojson, IRBushTree } from './types'

const treeLoad = (filePath: string): IRBushTree => {
  const tree = geojsonRbush()
  const sourceCommunes = JSON.parse(fs.readFileSync(filePath).toString())
    .features

  sourceCommunes.forEach((c: IGeojson) => tree.insert(c))

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

const communesTree = communesTreeGet()
const foretsTree = foretsTreeGet()

const communesFind = (geojson: IGeojson) =>
  rbushFind<ICommune, ICommune>(geojson, communesTree)

const foretsFind = (geojson: IGeojson) =>
  rbushFind<IForetInput, IForet>(geojson, foretsTree, foret => ({
    nom: foret.foret,
    code: foret.code_for,
    perimetre: foret.perimeter
  }))

export { communesFind, foretsFind }
