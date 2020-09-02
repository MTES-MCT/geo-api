import geojsonRbush, { RBush } from 'geojson-rbush'
import * as fs from 'fs'
import { Feature, MultiPolygon, Polygon, Properties } from '@turf/helpers'
import { rbushFind } from './rbush-find'
import { ICommune, IForetInput, IForetOutput } from './types'

export const treeLoad = (
  filePath: string
): RBush<Polygon | MultiPolygon, Properties> => {
  const tree = geojsonRbush()
  const sourceCommunes = JSON.parse(fs.readFileSync(filePath).toString())
    .features

  sourceCommunes.forEach((c: Feature<Polygon | MultiPolygon>) => tree.insert(c))

  return tree
}

const communesTreeGet = () => {
  console.info('Chargement des communes...')
  const tree = treeLoad('./sources/communes-100m.geojson')
  console.info('Chargement des communes terminé.')

  return tree
}
const communesTree = communesTreeGet()

const foretsTreeGet = () => {
  console.info('Chargement des forêts...')
  const tree = treeLoad('./sources/forets-guyane.geojson')
  console.info('Chargement des forêts terminé.')

  return tree
}
const foretsTree = foretsTreeGet()

export const communesFind = (body: Feature<Polygon | MultiPolygon>) => {
  return rbushFind<ICommune, ICommune>(body, communesTree, commune => commune)
}

export const foretsFind = (body: Feature<Polygon | MultiPolygon>) => {
  return rbushFind<IForetInput, IForetOutput>(body, foretsTree, foret => ({
    nom: foret.foret,
    code: foret.code_for,
    perimetre: foret.perimeter
  }))
}
