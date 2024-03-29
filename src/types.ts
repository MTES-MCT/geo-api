import { Polygon, Properties, Feature, MultiPolygon } from '@turf/helpers'
import { RBush } from 'geojson-rbush'

type IGeojson = Feature<Polygon | MultiPolygon>
type IRBushTree = RBush<Polygon | MultiPolygon, Properties>

interface IArea {
  nom: string
  code: string
  surface?: number
}

// Même format d’entrée et de sortie pour les communes
interface ICommune extends IArea {
  departement: string
  region: string
}

interface IForetInput {
  gid: number
  foret: string
  // eslint-disable-next-line camelcase
  code_for: string
  area: number
  perimeter: number
}

interface IForet extends IArea {
  perimetre: number
}

interface ISDOMZoneInput {
  id: string
  zone: string
}

interface ISDOMZone extends IArea {}

type IAreaFind<O> = (geojson: IGeojson) => O[]

interface IAreasIndex {
  communes: IAreaFind<ICommune>
  forets: IAreaFind<IForet>
  sdomZones: IAreaFind<ISDOMZone>
}

type IAreaId = keyof IAreasIndex

interface IAreas {
  communes?: ICommune[]
  forets?: IForet[]
  sdomZones?: ISDOMZone[]
}

export {
  IGeojson,
  IRBushTree,
  IArea,
  ICommune,
  IForet,
  IForetInput,
  IAreas,
  IAreaFind,
  IAreasIndex,
  IAreaId,
  ISDOMZoneInput,
  ISDOMZone
}
